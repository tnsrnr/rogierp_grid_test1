'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Download, Table, FileDown, Clipboard, ClipboardCopy } from 'lucide-react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { toast } from "sonner";
import "tabulator-tables/dist/css/tabulator.min.css";

// 제품 데이터 인터페이스
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
  lastUpdated: string;
}

export default function TabulatorCopyPaste() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);

  // 샘플 데이터
  const products: Product[] = [
    { id: 1, name: "스마트폰 A", category: "전자제품", price: 899000, stock: 120, supplier: "테크코리아", lastUpdated: "2023-11-05" },
    { id: 2, name: "노트북 프로", category: "전자제품", price: 1450000, stock: 78, supplier: "디지털월드", lastUpdated: "2023-11-10" },
    { id: 3, name: "무선 이어폰", category: "액세서리", price: 159000, stock: 240, supplier: "테크코리아", lastUpdated: "2023-11-12" },
    { id: 4, name: "스마트워치", category: "웨어러블", price: 299000, stock: 95, supplier: "웨어테크", lastUpdated: "2023-11-15" },
    { id: 5, name: "태블릿 12인치", category: "전자제품", price: 749000, stock: 62, supplier: "디지털월드", lastUpdated: "2023-11-18" },
    { id: 6, name: "블루투스 스피커", category: "액세서리", price: 89000, stock: 185, supplier: "사운드플러스", lastUpdated: "2023-11-20" },
    { id: 7, name: "게이밍 마우스", category: "컴퓨터 주변기기", price: 78000, stock: 210, supplier: "게이머기어", lastUpdated: "2023-11-22" },
    { id: 8, name: "기계식 키보드", category: "컴퓨터 주변기기", price: 129000, stock: 135, supplier: "게이머기어", lastUpdated: "2023-11-25" },
    { id: 9, name: "모니터 27인치", category: "전자제품", price: 349000, stock: 48, supplier: "디스플레이테크", lastUpdated: "2023-11-28" },
    { id: 10, name: "외장 하드 1TB", category: "저장장치", price: 99000, stock: 320, supplier: "데이터세이브", lastUpdated: "2023-12-01" },
    { id: 11, name: "그래픽카드", category: "컴퓨터 부품", price: 689000, stock: 32, supplier: "컴퓨텍", lastUpdated: "2023-12-03" },
    { id: 12, name: "CPU 프로세서", category: "컴퓨터 부품", price: 459000, stock: 55, supplier: "컴퓨텍", lastUpdated: "2023-12-05" },
    { id: 13, name: "메모리 16GB", category: "컴퓨터 부품", price: 109000, stock: 180, supplier: "메모리월드", lastUpdated: "2023-12-08" },
    { id: 14, name: "SSD 512GB", category: "저장장치", price: 129000, stock: 225, supplier: "데이터세이브", lastUpdated: "2023-12-10" },
    { id: 15, name: "USB-C 충전기", category: "액세서리", price: 35000, stock: 340, supplier: "파워서플라이", lastUpdated: "2023-12-12" },
  ];

  // 테이블 초기화
  useEffect(() => {
    if (tableRef.current) {
      try {
        const table = new Tabulator(tableRef.current, {
          data: products,
          layout: "fitColumns",
          responsiveLayout: "hide",
          pagination: true,
          paginationSize: 10,
          clipboard: true, // 클립보드 기능 활성화
          clipboardPasteAction: "replace", // 복사된 데이터를 어떻게 처리할지 설정 (replace, append, update)
          clipboardCopyConfig: {
            columnHeaders: true, // 열 헤더 포함
            rowGroups: false,
            columnCalcs: false,
          },
          columns: [
            { title: "ID", field: "id", sorter: "number", editor: false, headerSort: true, width: 70 },
            { title: "제품명", field: "name", sorter: "string", editor: "input", headerSort: true },
            { title: "카테고리", field: "category", sorter: "string", editor: "list", editorParams: {
              values: ["전자제품", "액세서리", "웨어러블", "컴퓨터 주변기기", "저장장치", "컴퓨터 부품"]
            }, headerSort: true },
            { title: "가격", field: "price", sorter: "number", editor: "number", formatter: "money", formatterParams: {
              thousand: ",",
              symbol: "₩",
              precision: 0
            }, headerSort: true },
            { title: "재고", field: "stock", sorter: "number", editor: "number", headerSort: true },
            { title: "공급업체", field: "supplier", sorter: "string", editor: "input", headerSort: true },
            { title: "최종 업데이트", field: "lastUpdated", sorter: "date", editor: "date", headerSort: true },
          ],
          // 데이터 수정 후 이벤트
          cellEdited: function(cell) {
            const field = cell.getField();
            const row = cell.getRow();
            
            // 현재 날짜로 최종 업데이트 필드 갱신
            if (field !== "lastUpdated") {
              const today = new Date();
              const dateString = today.toISOString().split('T')[0];
              row.update({ lastUpdated: dateString });
            }
          },
        });

        // 클립보드 이벤트
        document.addEventListener('paste', function(e) {
          if (table) {
            try {
              // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
              const clipboard = (e.clipboardData || window.clipboardData);
              const data = clipboard.getData('text');
              if (data && data.trim()) {
                try {
                  // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
                  table.modules.clipboard.setPasteData(data);
                  toast.success("데이터가 성공적으로 붙여넣기 되었습니다.", {
                    duration: 3000,
                  });
                } catch (err) {
                  toast.error("데이터 붙여넣기 중 오류가 발생했습니다.", {
                    duration: 3000,
                  });
                }
              }
            } catch (error) {
              console.error("클립보드 처리 중 오류:", error);
            }
          }
        });
        
        setTabulator(table);
      } catch (error) {
        console.error("테이블 초기화 오류:", error);
        toast.error("테이블 초기화 중 오류가 발생했습니다.");
      }
    }
    
    return () => {
      if (tabulator) {
        tabulator.destroy();
      }
    };
  }, []);

  // 테이블 데이터를 엑셀로 내보내기
  const exportToExcel = () => {
    tabulator?.download("xlsx", "product_data.xlsx", { sheetName: "제품 목록" });
    toast.success("엑셀 파일로 내보내기가 완료되었습니다.");
  };

  // 테이블 데이터를 CSV로 내보내기
  const exportToCSV = () => {
    tabulator?.download("csv", "product_data.csv", { delimiter: "," });
    toast.success("CSV 파일로 내보내기가 완료되었습니다.");
  };

  // 현재 테이블 내용을 클립보드에 복사
  const copyToClipboard = () => {
    if (tabulator) {
      try {
        // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
        tabulator.copyToClipboard("all", true); // "all": 모든 데이터, "selected": 선택된 행만, "visible": 현재 보이는 데이터만
        toast.success("테이블 데이터가 클립보드에 복사되었습니다.");
      } catch (error) {
        console.error("클립보드 복사 오류:", error);
        toast.error("클립보드 복사 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/gridtest/tabulator">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">복사/붙여넣기 기능</h1>
          <p className="text-gray-500 mt-1">엑셀과 유사한 복사/붙여넣기 기능을 지원하는 Tabulator 예제입니다.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>제품 목록</CardTitle>
          <CardDescription>
            이 테이블은 Excel과 유사한 복사/붙여넣기 기능을 지원합니다. 테이블 데이터를 선택하고 Ctrl+C로 복사하거나, Excel에서 복사한 데이터를 Ctrl+V로 테이블에 붙여넣을 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={copyToClipboard}>
              <ClipboardCopy className="h-4 w-4 mr-2" />
              클립보드에 복사
            </Button>
            <Button variant="outline" onClick={exportToExcel}>
              <FileDown className="h-4 w-4 mr-2" />
              Excel로 내보내기
            </Button>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV로 내보내기
            </Button>
          </div>
          
          <div ref={tableRef} className="w-full" />
          
          <div className="mt-4 bg-blue-50 p-3 rounded-md text-sm text-blue-600">
            <p><strong>사용 방법:</strong></p>
            <ul className="list-disc pl-5 mt-1">
              <li>셀을 직접 클릭하여 데이터를 편집할 수 있습니다.</li>
              <li>셀 범위를 선택하고 Ctrl+C (또는 Cmd+C)를 눌러 복사할 수 있습니다.</li>
              <li>테이블에서 셀을 선택하고 Ctrl+V (또는 Cmd+V)를 눌러 Excel에서 복사한 데이터를 붙여넣을 수 있습니다.</li>
              <li>데이터를 편집하면 자동으로 '최종 업데이트' 필드가 오늘 날짜로 갱신됩니다.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 