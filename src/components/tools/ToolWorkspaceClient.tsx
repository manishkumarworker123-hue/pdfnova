"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { 
  UploadCloud, File, Trash2, Layers, FileText, Minimize2, Check, 
  ArrowDown, RotateCw, PlusCircle, LayoutGrid, Copy, Clipboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import JSZip from "jszip";
import Tesseract from "tesseract.js";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toolsList } from "@/config/tools";

// Load PDF.js dynamically from CDN to prevent Turbopack bundle worker errors
const loadPdfJs = async () => {
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
      resolve(pdfjs);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

interface ToolWorkspaceClientProps {
  toolId: string;
}

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: string;
  pageCount?: number;
}

interface PageItemState {
  id: string;
  originalIndex: number;
  rotation: number;
  isBlank: boolean;
}

export default function ToolWorkspaceClient({ toolId }: ToolWorkspaceClientProps) {
  const toast = useToast();
  const { user } = useAuth();
  const tool = toolsList.find(t => t.id === toolId);

  // States
  const [files, setFiles] = useState<FileItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState("");
  const [extractedText, setExtractedText] = useState("");

  // Tool Specific parameters
  const [password, setPassword] = useState("");
  const [unlockPassword, setUnlockPassword] = useState("");
  const [watermarkText, setWatermarkText] = useState("PDFNova");
  const [watermarkColor, setWatermarkColor] = useState("#3b82f6");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.4);
  const [compressLevel, setCompressLevel] = useState("medium");
  const [pageRange, setPageRange] = useState("1");
  const [rotateAngle, setRotateAngle] = useState(90);
  const [ocrLanguage, setOcrLanguage] = useState("eng");

  // Organize tool state
  const [pagesState, setPagesState] = useState<PageItemState[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    await processUploadedFiles(droppedFiles);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    await processUploadedFiles(selected);
  };

  const processUploadedFiles = async (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (toolId === "word-to-pdf") {
        return ext === "doc" || ext === "docx";
      }
      if (toolId === "jpg-to-pdf") {
        return ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "webp";
      }
      return ext === "pdf";
    });

    if (validFiles.length === 0) {
      toast.error("Invalid File Format", "Please upload the requested format for this tool.");
      return;
    }

    const items: FileItem[] = [];
    for (const f of validFiles) {
      const sizeStr = `${(f.size / (1024 * 1024)).toFixed(2)} MB`;
      const item: FileItem = {
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        size: sizeStr
      };

      if (f.name.endsWith(".pdf")) {
        try {
          const buffer = await f.arrayBuffer();
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          item.pageCount = doc.getPageCount();

          if (toolId === "organize-pdf") {
            const initialPages: PageItemState[] = Array.from({ length: item.pageCount }, (_, idx) => ({
              id: Math.random().toString(36).substring(2, 9),
              originalIndex: idx,
              rotation: 0,
              isBlank: false
            }));
            setPagesState(initialPages);
          }
        } catch (e) {
          console.error("Local parsing error:", e);
        }
      }
      items.push(item);
    }

    setFiles(prev => [...prev, ...items]);
    toast.success("File added", `Successfully queued ${items.length} document(s).`);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (toolId === "organize-pdf") {
      setPagesState([]);
    }
  };

  const syncSessionToFirestore = async (name: string, size: number, dlUrl: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "sessions"), {
        userId: user.uid,
        toolType: toolId,
        status: "completed",
        createdAt: new Date(),
        outputFile: {
          fileName: name,
          fileSize: size,
          downloadUrl: dlUrl
        }
      });
    } catch (e) {
      console.error("Firestore logging failed:", e);
    }
  };

  const parsePageRange = (rangeStr: string, maxPages: number): number[] => {
    const pages: number[] = [];
    const parts = rangeStr.split(",");
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [start, end] = trimmed.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= maxPages) pages.push(i);
          }
        }
      } else {
        const p = Number(trimmed);
        if (!isNaN(p) && p >= 1 && p <= maxPages) pages.push(p);
      }
    }
    return pages.length > 0 ? pages : [1];
  };

  const buildDocxBlob = (text: string): Promise<Blob> => {
    const zip = new JSZip();
    
    zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);

    zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

    const cleanText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const paragraphsXml = cleanText.split("\n").map(para => `
      <w:p>
        <w:r>
          <w:t>${para}</w:t>
        </w:r>
      </w:p>
    `).join("");

    zip.file("word/document.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphsXml}
  </w:body>
</w:document>`);

    return zip.generateAsync({ type: "blob" });
  };

  const executeProcess = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setProgress(10);
    setSuccess(false);
    setExtractedText("");

    try {
      let outputBlob: Blob | null = null;
      let finalName = "";

      if (toolId === "merge-pdf") {
        const mergedPdf = await PDFDocument.create();
        for (const fileItem of files) {
          const buffer = await fileItem.file.arrayBuffer();
          const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        const bytes = await mergedPdf.save();
        outputBlob = new Blob([bytes as any], { type: "application/pdf" });
        finalName = "merged_pdfnova.pdf";
      }

      else if (toolId === "split-pdf") {
        const primary = files[0];
        const buffer = await primary.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        
        const newPdf = await PDFDocument.create();
        const pages = parsePageRange(pageRange, srcDoc.getPageCount());
        const copied = await newPdf.copyPages(srcDoc, pages.map(p => p - 1));
        copied.forEach(p => newPdf.addPage(p));
        
        const bytes = await newPdf.save();
        outputBlob = new Blob([bytes as any], { type: "application/pdf" });
        finalName = `split_${primary.name}`;
      }

      else if (toolId === "compress-pdf") {
        const primary = files[0];
        const buffer = await primary.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const bytes = await doc.save({ useObjectStreams: true });
        outputBlob = new Blob([bytes as any], { type: "application/pdf" });
        finalName = `compressed_${primary.name}`;
      }

      else if (toolId === "rotate-pdf") {
        const primary = files[0];
        const buffer = await primary.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        doc.getPages().forEach(page => {
          page.setRotation(degrees(rotateAngle));
        });
        const bytes = await doc.save();
        outputBlob = new Blob([bytes as any], { type: "application/pdf" });
        finalName = `rotated_${primary.name}`;
      }

      else if (toolId === "delete-pages") {
        const primary = files[0];
        const buffer = await primary.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const toDelete = parsePageRange(pageRange, doc.getPageCount()).map(p => p - 1);
        
        toDelete.sort((a, b) => b - a).forEach(idx => {
          if (idx >= 0 && idx < doc.getPageCount()) {
            doc.removePage(idx);
          }
        });
        const bytes = await doc.save();
        outputBlob = new Blob([bytes as any], { type: "application/pdf" });
        finalName = `modified_${primary.name}`;
      }

      else if (toolId === "extract-pages") {
        const primary = files[0];
        const buffer = await primary.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const toExtract = parsePageRange(pageRange, doc.getPageCount()).map(p => p - 1);
        
        const newPdf = await PDFDocument.create();
        const copied = await newPdf.copyPages(doc, toExtract);
        copied.forEach(p => newPdf.addPage(p));
        const bytes = await newPdf.save();
        outputBlob = new Blob([bytes as any], { type: "application/pdf" });
        finalName = `extracted_${primary.name}`;
      }

      else if (toolId === "watermark-pdf") {
        const primary = files[0];
        const buffer = await primary.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        
        const hex = watermarkColor.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;

        doc.getPages().forEach(page => {
          page.drawText(watermarkText, {
            x: page.getWidth() / 4,
            y: page.getHeight() / 2,
            size: 44,
            color: rgb(r, g, b),
            opacity: watermarkOpacity,
            rotate: degrees(45)
          });
        });
        const bytes = await doc.save();
        outputBlob = new Blob([bytes as any], { type: "application/pdf" });
        finalName = `watermarked_${primary.name}`;
      }

      else if (toolId === "protect-pdf") {
        const primary = files[0];
        const buffer = await primary.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const bytes = await doc.save();
        outputBlob = new Blob([bytes as any], { type: "application/pdf" });
        finalName = `protected_${primary.name}`;
      }

      else if (toolId === "unlock-pdf") {
        const primary = files[0];
        const buffer = await primary.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const bytes = await doc.save();
        outputBlob = new Blob([bytes as any], { type: "application/pdf" });
        finalName = `unlocked_${primary.name}`;
      }

      else if (toolId === "jpg-to-pdf") {
        const newPdf = await PDFDocument.create();
        for (const fileItem of files) {
          const imgBuffer = await fileItem.file.arrayBuffer();
          let embeddedImage;
          if (fileItem.name.toLowerCase().endsWith(".png")) {
            embeddedImage = await newPdf.embedPng(imgBuffer);
          } else {
            embeddedImage = await newPdf.embedJpg(imgBuffer);
          }
          const page = newPdf.addPage([embeddedImage.width, embeddedImage.height]);
          page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: embeddedImage.width,
            height: embeddedImage.height
          });
        }
        const bytes = await newPdf.save();
        outputBlob = new Blob([bytes as any], { type: "application/pdf" });
        finalName = "images_compiled_pdfnova.pdf";
      }

      else if (toolId === "pdf-to-jpg") {
        const primary = files[0];
        const buffer = await primary.file.arrayBuffer();
        const pdfjs = await loadPdfJs();
        const loadingTask = pdfjs.getDocument({ data: buffer });
        const pdf = await loadingTask.promise;

        const zip = new JSZip();
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          await page.render({ canvasContext: context, viewport }).promise;
          const imgData = canvas.toDataURL("image/jpeg", 0.9).split(",")[1];
          zip.file(`page_${i}.jpg`, imgData, { base64: true });
          
          setProgress(10 + Math.floor((i / pdf.numPages) * 70));
        }

        outputBlob = await zip.generateAsync({ type: "blob" });
        finalName = `${primary.name.split(".")[0]}_pages.zip`;
      }

      else if (toolId === "pdf-to-word") {
        const primary = files[0];
        const buffer = await primary.file.arrayBuffer();
        const pdfjs = await loadPdfJs();
        const loadingTask = pdfjs.getDocument({ data: buffer });
        const pdf = await loadingTask.promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += `--- Page ${i} ---\n\n${pageText}\n\n`;
          setProgress(10 + Math.floor((i / pdf.numPages) * 70));
        }

        outputBlob = await buildDocxBlob(fullText);
        finalName = `${primary.name.split(".")[0]}.docx`;
      }

      else if (toolId === "word-to-pdf") {
        const primary = files[0];
        const buffer = await primary.file.arrayBuffer();
        
        const zip = await JSZip.loadAsync(buffer);
        const docXml = await zip.file("word/document.xml")?.async("text");
        
        if (!docXml) {
          throw new Error("Unable to parse file. The DOCX structure is corrupt.");
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(docXml, "text/xml");
        const paragraphs = xmlDoc.getElementsByTagName("w:p");
        const lines: string[] = [];

        for (let i = 0; i < paragraphs.length; i++) {
          const textNodes = paragraphs[i].getElementsByTagName("w:t");
          let text = "";
          for (let j = 0; j < textNodes.length; j++) {
            text += textNodes[j].textContent || "";
          }
          lines.push(text);
        }

        const newPdf = await PDFDocument.create();
        let page = newPdf.addPage();
        const { width, height } = page.getSize();
        let y = height - 50;

        for (const line of lines) {
          if (y < 60) {
            page = newPdf.addPage();
            y = height - 50;
          }
          page.drawText(line, {
            x: 50,
            y: y,
            size: 11,
            maxWidth: width - 100,
            lineHeight: 14
          });
          y -= 22;
        }

        const bytes = await newPdf.save();
        outputBlob = new Blob([bytes as any], { type: "application/pdf" });
        finalName = `${primary.name.split(".")[0]}.pdf`;
      }

      else if (toolId === "organize-pdf") {
        const primary = files[0];
        const buffer = await primary.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        
        const newPdf = await PDFDocument.create();
        for (const pageState of pagesState) {
          if (pageState.isBlank) {
            newPdf.addPage();
          } else {
            const [copied] = await newPdf.copyPages(srcDoc, [pageState.originalIndex]);
            copied.setRotation(degrees(pageState.rotation));
            newPdf.addPage(copied);
          }
        }
        
        const bytes = await newPdf.save();
        outputBlob = new Blob([bytes as any], { type: "application/pdf" });
        finalName = `organized_${primary.name}`;
      }

      else if (toolId === "ocr-pdf") {
        const primary = files[0];
        const buffer = await primary.file.arrayBuffer();
        const pdfjs = await loadPdfJs();
        const loadingTask = pdfjs.getDocument({ data: buffer });
        const pdf = await loadingTask.promise;

        let fullOcrText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          await page.render({ canvasContext: context, viewport }).promise;
          const { data: { text } } = await Tesseract.recognize(canvas, ocrLanguage);
          fullOcrText += `--- Page ${i} ---\n\n${text}\n\n`;
          setProgress(10 + Math.floor((i / pdf.numPages) * 80));
        }

        setExtractedText(fullOcrText);
        outputBlob = new Blob([fullOcrText], { type: "text/plain;charset=utf-8" });
        finalName = `${primary.name.split(".")[0]}_extracted_ocr.txt`;
      }

      setProgress(90);
      
      if (outputBlob) {
        const url = URL.createObjectURL(outputBlob);
        setDownloadUrl(url);
        setOutputFileName(finalName);
        await syncSessionToFirestore(finalName, outputBlob.size, url);
      }

      setProgress(100);
      setSuccess(true);
      toast.success("Process Completed", "Your document was compiled successfully.");
    } catch (e: any) {
      console.error(e);
      toast.error("Compilation Failed", e.message || "An error occurred during local file parsing.");
    } finally {
      setProcessing(false);
    }
  };

  const resetWorkspace = () => {
    setFiles([]);
    setSuccess(false);
    setDownloadUrl(null);
    setProgress(0);
    setPagesState([]);
    setExtractedText("");
  };

  // Organize Actions
  const rotatePageItem = (id: string, dir: "left" | "right") => {
    setPagesState(prev => prev.map(p => {
      if (p.id !== id) return p;
      const change = dir === "right" ? 90 : -90;
      let nextRot = (p.rotation + change) % 360;
      if (nextRot < 0) nextRot += 360;
      return { ...p, rotation: nextRot };
    }));
  };

  const deletePageItem = (id: string) => {
    setPagesState(prev => prev.filter(p => p.id !== id));
  };

  const duplicatePageItem = (id: string, index: number) => {
    const item = pagesState.find(p => p.id === id);
    if (!item) return;
    const duplicated: PageItemState = {
      ...item,
      id: Math.random().toString(36).substring(2, 9)
    };
    const nextList = [...pagesState];
    nextList.splice(index + 1, 0, duplicated);
    setPagesState(nextList);
  };

  const insertBlankPage = (index: number) => {
    const blank: PageItemState = {
      id: Math.random().toString(36).substring(2, 9),
      originalIndex: -1,
      rotation: 0,
      isBlank: true
    };
    const nextList = [...pagesState];
    nextList.splice(index + 1, 0, blank);
    setPagesState(nextList);
  };

  const movePageItem = (index: number, dir: "up" | "down") => {
    if (dir === "up" && index === 0) return;
    if (dir === "down" && index === pagesState.length - 1) return;
    const targetIdx = dir === "up" ? index - 1 : index + 1;
    const nextList = [...pagesState];
    const temp = nextList[index];
    nextList[index] = nextList[targetIdx];
    nextList[targetIdx] = temp;
    setPagesState(nextList);
  };

  if (!tool) return null;

  const showParamsPanel = files.length > 0 && !success;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Area (Cols 1-3) */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        
        {/* Upload Dropzone */}
        {!success && files.length === 0 && (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex-1 min-h-[400px] border-2 border-dashed border-border/80 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-card/40 hover:border-primary/50 hover:bg-card/70 transition-all duration-300 relative group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple={toolId === "merge-pdf" || toolId === "jpg-to-pdf"}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">Drag and drop your files here</h3>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
              Or click to browse from folders. File processing happens directly in your browser cache.
            </p>
            <Button size="md" onClick={() => fileInputRef.current?.click()}>Browse Files</Button>
          </div>
        )}

        {/* Organize Grid */}
        {!success && files.length > 0 && toolId === "organize-pdf" && (
          <Card className="flex-1 p-6 border border-border/60 bg-card/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <LayoutGrid className="w-4.5 h-4.5 text-primary" /> Organize Pages Grid
              </h3>
              <button onClick={resetWorkspace} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {pagesState.map((pageState, idx) => (
                <div 
                  key={pageState.id} 
                  className="border border-border bg-card p-3 rounded-xl flex flex-col items-center relative group"
                >
                  <div className="absolute top-2 left-2 text-[10px] font-bold text-muted-foreground bg-muted border border-border/40 px-1.5 py-0.5 rounded">
                    {idx + 1}
                  </div>

                  <div 
                    className="w-full aspect-[3/4] border border-border/50 rounded-lg mb-3 flex items-center justify-center bg-muted/40 overflow-hidden"
                    style={{ transform: `rotate(${pageState.rotation}deg)`, transition: "transform 0.2s" }}
                  >
                    {pageState.isBlank ? (
                      <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Blank Page</span>
                    ) : (
                      <FileText className="w-8 h-8 text-muted-foreground/50" />
                    )}
                  </div>

                  <div className="flex gap-1.5 w-full justify-center">
                    <button
                      onClick={() => rotatePageItem(pageState.id, "left")}
                      className="p-1 rounded bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground"
                    >
                      <RotateCw className="w-3 h-3 -scale-x-100" />
                    </button>
                    <button
                      onClick={() => rotatePageItem(pageState.id, "right")}
                      className="p-1 rounded bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => duplicatePageItem(pageState.id, idx)}
                      className="p-1 rounded bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => insertBlankPage(idx)}
                      className="p-1 rounded bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground"
                    >
                      <PlusCircle className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deletePageItem(pageState.id)}
                      className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex justify-between w-full mt-2 text-[10px] border-t border-border/30 pt-2">
                    <button onClick={() => movePageItem(idx, "up")} className="hover:text-primary disabled:opacity-30" disabled={idx === 0}>
                      Move Left
                    </button>
                    <button onClick={() => movePageItem(idx, "down")} className="hover:text-primary disabled:opacity-30" disabled={idx === pagesState.length - 1}>
                      Move Right
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Standard File Queue List */}
        {!success && files.length > 0 && toolId !== "organize-pdf" && (
          <Card className="flex-1 p-6 border border-border/60 bg-card/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <File className="w-4.5 h-4.5 text-primary" /> Queued Files ({files.length})
              </h3>
              <button onClick={resetWorkspace} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {files.map((fileItem) => (
                <div key={fileItem.id} className="p-4 border border-border/60 bg-card rounded-xl flex items-center justify-between gap-3 group relative">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-foreground truncate max-w-[160px]">{fileItem.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        {fileItem.size} {fileItem.pageCount && `\u2022 ${fileItem.pageCount} Pages`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 2. Success screen */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-card border border-border/50 rounded-2xl shadow-xl"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-6">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-foreground mb-2">Process Completed successfully!</h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
              Your output file <span className="font-semibold text-foreground">{outputFileName}</span> was compiled locally.
            </p>
            
            {/* Extracted Text (OCR Result) */}
            {extractedText && (
              <div className="w-full max-w-2xl text-left bg-muted border border-border rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-border/50">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Extracted Text</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(extractedText);
                      toast.success("Copied", "Extracted text copied to clipboard.");
                    }}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Clipboard className="w-3.5 h-3.5" /> Copy Text
                  </button>
                </div>
                <pre className="text-xs text-foreground overflow-y-auto max-h-40 font-mono whitespace-pre-wrap leading-normal">
                  {extractedText}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              {downloadUrl && (
                <a href={downloadUrl} download={outputFileName} className="flex-1">
                  <Button size="lg" className="w-full">
                    <ArrowDown className="w-5 h-5 mr-2" /> Download File
                  </Button>
                </a>
              )}
              <Button variant="outline" size="lg" onClick={resetWorkspace} className="flex-1">
                Process Another File
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Configuration Parameter Panel */}
      <div className="flex flex-col gap-6">
        {showParamsPanel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border border-border/50 bg-card p-6 flex flex-col gap-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Adjust Parameters</h3>
              
              {/* SPLIT / EXTRACT PARAM */}
              {(toolId === "split-pdf" || toolId === "extract-pages" || toolId === "delete-pages") && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-foreground">Select Page Range</label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g. 1-2, 5"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <p className="text-[10px] text-muted-foreground">Use comma for multiple page ranges</p>
                </div>
              )}

              {/* OCR PARAM */}
              {toolId === "ocr-pdf" && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-foreground">OCR Language</label>
                  <select
                    value={ocrLanguage}
                    onChange={(e) => setOcrLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="eng">English (eng)</option>
                    <option value="hin">Hindi (hin)</option>
                  </select>
                </div>
              )}

              {/* COMPRESS PARAM */}
              {toolId === "compress-pdf" && (
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-semibold text-foreground">Compression Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["low", "medium", "high"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setCompressLevel(level)}
                        className={`py-2 rounded-lg border text-xs capitalize font-medium transition-colors ${
                          compressLevel === level
                            ? "bg-primary border-primary text-white"
                            : "bg-background border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ROTATE PARAM */}
              {toolId === "rotate-pdf" && (
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-semibold text-foreground">Rotation angle</label>
                  <select
                    value={rotateAngle}
                    onChange={(e) => setRotateAngle(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value={90}>90&deg; Right</option>
                    <option value={180}>180&deg; Flip</option>
                    <option value={270}>90&deg; Left</option>
                  </select>
                </div>
              )}

              {/* WATERMARK PARAM */}
              {toolId === "watermark-pdf" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-foreground">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-foreground">Stamp Color</label>
                    <input
                      type="color"
                      value={watermarkColor}
                      onChange={(e) => setWatermarkColor(e.target.value)}
                      className="w-full h-10 p-1 bg-background border border-border rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* PROTECT PARAM */}
              {toolId === "protect-pdf" && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-foreground">Secure Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              {/* UNLOCK PARAM */}
              {toolId === "unlock-pdf" && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-foreground">Document Password</label>
                  <input
                    type="password"
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    placeholder="Enter PDF password"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              <hr className="border-border/50" />

              <Button
                size="lg"
                className="w-full"
                onClick={executeProcess}
                isLoading={processing}
              >
                Process PDF
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
