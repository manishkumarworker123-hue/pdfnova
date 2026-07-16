import { 
  Layers, Scissors, Minimize2, FileText, Lock, Unlock, Stamp, Settings, Type, RefreshCw, Trash2
} from "lucide-react";

export const toolsList = [
  { id: "merge-pdf", name: "Merge PDF", icon: Layers, desc: "Combine multiple files into one PDF", cat: "organize" },
  { id: "split-pdf", name: "Split PDF", icon: Scissors, desc: "Extract pages or split into multiple files", cat: "organize" },
  { id: "compress-pdf", name: "Compress PDF", icon: Minimize2, desc: "Reduce file size without losing quality", cat: "optimize" },
  { id: "pdf-to-word", name: "PDF to Word", icon: FileText, desc: "Convert PDF to editable DOCX", cat: "convert-from" },
  { id: "word-to-pdf", name: "Word to PDF", icon: FileText, desc: "Convert DOCX/DOC files to PDF", cat: "convert-to" },
  { id: "jpg-to-pdf", name: "JPG to PDF", icon: FileText, desc: "Convert JPG/PNG/WEBP to PDF", cat: "convert-to" },
  { id: "pdf-to-jpg", name: "PDF to JPG", icon: FileText, desc: "Extract pages as JPG images", cat: "convert-from" },
  { id: "rotate-pdf", name: "Rotate PDF", icon: RefreshCw, desc: "Rotate pages left, right or 180°", cat: "edit" },
  { id: "delete-pages", name: "Delete Pages", icon: Trash2, desc: "Remove unwanted pages from PDF", cat: "edit" },
  { id: "extract-pages", name: "Extract Pages", icon: FileText, desc: "Save specific pages as a new PDF", cat: "edit" },
  { id: "protect-pdf", name: "Protect PDF", icon: Lock, desc: "Encrypt PDF with a secure password", cat: "security" },
  { id: "unlock-pdf", name: "Unlock PDF", icon: Unlock, desc: "Remove password protection from PDF", cat: "security" },
  { id: "watermark-pdf", name: "Watermark PDF", icon: Stamp, desc: "Stamp text or image watermarks", cat: "edit" },
  { id: "organize-pdf", name: "Organize PDF", icon: Settings, desc: "Rearrange, rotate or insert pages", cat: "organize" },
  { id: "ocr-pdf", name: "OCR PDF", icon: Type, desc: "Extract text from scanned documents", cat: "optimize" }
];
