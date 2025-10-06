import { UploadedFile } from '../types';
import { PDFProcessor } from './pdfProcessor';

export class FileProcessor {
  private static pdfProcessor = PDFProcessor.getInstance();

  static async processFile(fileObj: UploadedFile): Promise<void> {
    try {
      fileObj.status = 'processing';
      let text = '';
      
      if (fileObj.file.type === 'application/pdf') {
        text = await this.pdfProcessor.extractTextFromPDF(fileObj.file);
      } else if (fileObj.file.type.includes('word') || fileObj.file.name.toLowerCase().endsWith('.docx') || fileObj.file.name.toLowerCase().endsWith('.doc')) {
        text = await this.extractTextFromWord(fileObj.file);
      } else if (fileObj.file.type === 'text/plain' || fileObj.file.name.toLowerCase().endsWith('.txt')) {
        text = await this.extractTextFromPlainText(fileObj.file);
      } else {
        throw new Error('Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files.');
      }
      
      if (!text || text.trim().length < 50) {
        throw new Error('Could not extract sufficient text from the file. Please ensure the file contains readable text.');
      }
      
      fileObj.text = this.cleanExtractedText(text);
      fileObj.status = 'completed';
      fileObj.error = null;
      
    } catch (error) {
      console.error('Error processing file:', error);
      fileObj.status = 'error';
      fileObj.error = error instanceof Error ? error.message : 'Unknown error occurred while processing file';
      throw error;
    }
  }

  private static async extractTextFromWord(file: File): Promise<string> {
    try {
      const mammoth = await import('mammoth');
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function() {
          try {
            const arrayBuffer = this.result as ArrayBuffer;
            const result = await mammoth.extractRawText({ arrayBuffer });
            
            if (!result.value || result.value.trim().length < 10) {
              throw new Error('No text could be extracted from the Word document.');
            }
            
            resolve(result.value);
          } catch (error) {
            console.error('Word processing error:', error);
            reject(new Error(`Failed to parse Word document: ${error instanceof Error ? error.message : 'Unknown error'}`));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read Word document. The file might be corrupted.'));
        };
        
        reader.readAsArrayBuffer(file);
      });
    } catch (importError) {
      throw new Error('Word document processing is not available. Please convert to PDF or plain text.');
    }
  }

  private static async extractTextFromPlainText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function() {
        try {
          const text = this.result as string;
          if (!text || text.trim().length < 10) {
            throw new Error('The text file appears to be empty or too short.');
          }
          resolve(text);
        } catch (error) {
          reject(new Error('Failed to read text file.'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read text file.'));
      };
      
      reader.readAsText(file, 'utf-8');
    });
  }

  private static cleanExtractedText(text: string): string {
    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove excessive line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Remove special characters that might interfere with processing
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      // Trim whitespace
      .trim();
  }

  static validateFile(file: File): { valid: boolean; error?: string } {
    // Special handling for PDF files
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return this.pdfProcessor.validatePDFFile(file);
    }

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    const validExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    const maxSize = 15 * 1024 * 1024; // 15MB for better PDF support
    const minSize = 100; // 100 bytes minimum
    
    // Check file size
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Please upload files under 15MB.' };
    }
    
    if (file.size < minSize) {
      return { valid: false, error: 'File too small. Please ensure the file contains content.' };
    }
    
    // Check file type and extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    const hasValidType = validTypes.includes(file.type);
    
    if (!hasValidExtension && !hasValidType) {
      return { 
        valid: false, 
        error: 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.' 
      };
    }
    
    // Additional validation for specific file types
    if (fileName.endsWith('.pdf') && file.type !== 'application/pdf') {
      return { valid: false, error: 'PDF file type mismatch. Please ensure the file is a valid PDF.' };
    }
    
    return { valid: true };
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getFileIcon(fileType: string, fileName: string): string {
    const name = fileName.toLowerCase();
    if (fileType === 'application/pdf' || name.endsWith('.pdf')) return '📄';
    if (fileType.includes('word') || name.endsWith('.doc') || name.endsWith('.docx')) return '📝';
    if (fileType === 'text/plain' || name.endsWith('.txt')) return '📃';
    return '📄';
  }

  static getFileTypeLabel(fileType: string, fileName: string): string {
    const name = fileName.toLowerCase();
    if (fileType === 'application/pdf' || name.endsWith('.pdf')) return 'PDF';
    if (fileType.includes('word') || name.endsWith('.doc') || name.endsWith('.docx')) return 'Word Document';
    if (fileType === 'text/plain' || name.endsWith('.txt')) return 'Text File';
    return 'Document';
  }
}