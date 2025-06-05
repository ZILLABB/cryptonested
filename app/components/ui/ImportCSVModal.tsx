"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Download, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { addHolding, addTransaction } from '../../services/portfolioService';
import { useAuth } from '../../../contexts/AuthContext';

interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId?: string;
  onImportComplete?: () => void;
}

interface CSVRow {
  symbol: string;
  quantity: number;
  price: number;
  date: string;
  valid: boolean;
  error?: string;
}

export function ImportCSVModal({ 
  isOpen, 
  onClose, 
  portfolioId, 
  onImportComplete 
}: ImportCSVModalProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    
    // Expected headers: symbol, quantity, price, date
    const requiredHeaders = ['symbol', 'quantity', 'price', 'date'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      alert(`Missing required headers: ${missingHeaders.join(', ')}`);
      return;
    }

    const data: CSVRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      const csvRow: CSVRow = {
        symbol: row.symbol?.toUpperCase() || '',
        quantity: parseFloat(row.quantity) || 0,
        price: parseFloat(row.price) || 0,
        date: row.date || '',
        valid: true,
        error: ''
      };

      // Validate row
      if (!csvRow.symbol) {
        csvRow.valid = false;
        csvRow.error = 'Missing symbol';
      } else if (csvRow.quantity <= 0) {
        csvRow.valid = false;
        csvRow.error = 'Invalid quantity';
      } else if (csvRow.price <= 0) {
        csvRow.valid = false;
        csvRow.error = 'Invalid price';
      } else if (!csvRow.date || isNaN(Date.parse(csvRow.date))) {
        csvRow.valid = false;
        csvRow.error = 'Invalid date';
      }

      data.push(csvRow);
    }

    setCsvData(data);
  };

  const handleImport = async () => {
    if (!user || !portfolioId || csvData.length === 0) return;

    setImporting(true);
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const row of csvData) {
      if (!row.valid) {
        results.failed++;
        results.errors.push(`${row.symbol}: ${row.error}`);
        continue;
      }

      try {
        // Add holding
        const holdingResult = await addHolding(
          portfolioId,
          row.symbol.toLowerCase(), // Use symbol as coin ID for now
          row.quantity,
          row.price,
          row.date
        );

        if (!holdingResult.success) {
          throw new Error(holdingResult.error?.message || 'Failed to add holding');
        }

        // Add transaction
        await addTransaction(
          user.id,
          'buy',
          row.symbol.toLowerCase(),
          row.quantity,
          row.price,
          0,
          `CSV Import - ${row.symbol}`,
          row.date
        );

        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${row.symbol}: ${error.message}`);
      }
    }

    setImportResults(results);
    setImporting(false);

    if (results.success > 0) {
      onImportComplete?.();
    }
  };

  const downloadTemplate = () => {
    const template = 'symbol,quantity,price,date\nBTC,0.5,45000,2024-01-01\nETH,2.0,3000,2024-01-01\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setCsvData([]);
    setImportResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Import from CSV</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {!csvData.length && !importResults && (
                <div className="space-y-6">
                  {/* Instructions */}
                  <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-800 dark:text-blue-200">CSV Format</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                          Your CSV file should have the following columns: symbol, quantity, price, date
                        </p>
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadTemplate}
                            className="text-blue-600 border-blue-300 hover:bg-blue-100"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Template
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Select a CSV file with your portfolio holdings
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
                    >
                      Choose File
                    </Button>
                  </div>
                </div>
              )}

              {/* CSV Preview */}
              {csvData.length > 0 && !importResults && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Preview ({csvData.length} rows)</h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={resetModal}
                      >
                        Upload Different File
                      </Button>
                      <Button
                        onClick={handleImport}
                        disabled={importing || csvData.every(row => !row.valid)}
                        className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
                      >
                        {importing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          `Import ${csvData.filter(row => row.valid).length} Holdings`
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Symbol</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Quantity</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Price</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.map((row, index) => (
                          <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                            <td className="px-4 py-3">
                              {row.valid ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                              )}
                            </td>
                            <td className="px-4 py-3 font-medium">{row.symbol}</td>
                            <td className="px-4 py-3 text-right">{row.quantity}</td>
                            <td className="px-4 py-3 text-right">${row.price.toLocaleString()}</td>
                            <td className="px-4 py-3">{row.date}</td>
                            <td className="px-4 py-3 text-red-500 text-sm">{row.error}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Import Results */}
              {importResults && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Import Complete</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{importResults.success}</div>
                        <div className="text-sm text-green-600">Successfully Imported</div>
                      </div>
                    </Card>
                    
                    <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{importResults.failed}</div>
                        <div className="text-sm text-red-600">Failed</div>
                      </div>
                    </Card>
                  </div>

                  {importResults.errors.length > 0 && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-2">Errors:</h4>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {importResults.errors.map((error, index) => (
                          <div key={index} className="text-sm text-red-600">{error}</div>
                        ))}
                      </div>
                    </Card>
                  )}

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={resetModal}
                    >
                      Import More
                    </Button>
                    <Button
                      onClick={handleClose}
                      className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
