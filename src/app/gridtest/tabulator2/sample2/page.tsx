'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardCopy, Copy, Clipboard } from 'lucide-react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  salary: number;
  startDate: string;
  email: string;
  phone: string;
  status: string;
}

export default function TabulatorClipboardExample() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [selectedData, setSelectedData] = useState<string>("");

  // 샘플 데이터
  const data: Employee[] = [
    { id: 1, name: "김철수", position: "개발자", department: "개발팀", salary: 5000000, startDate: "2020-03-15", email: "kim@example.com", phone: "010-1234-5678", status: "정규직" },
    { id: 2, name: "이영희", position: "디자이너", department: "디자인팀", salary: 4800000, startDate: "2021-05-20", email: "lee@example.com", phone: "010-2345-6789", status: "정규직" },
    { id: 3, name: "박준호", position: "매니저", department: "인사팀", salary: 6200000, startDate: "2018-11-10", email: "park@example.com", phone: "010-3456-7890", status: "정규직" },
    { id: 4, name: "정미영", position: "시니어 개발자", department: "개발팀", salary: 5500000, startDate: "2019-07-22", email: "jung@example.com", phone: "010-4567-8901", status: "정규직" },
    { id: 5, name: "강동원", position: "마케터", department: "마케팅팀", salary: 4200000, startDate: "2022-01-15", email: "kang@example.com", phone: "010-5678-9012", status: "계약직" },
    { id: 6, name: "한지민", position: "회계사", department: "재무팀", salary: 5900000, startDate: "2017-09-05", email: "han@example.com", phone: "010-6789-0123", status: "정규직" },
    { id: 7, name: "오세진", position: "주니어 개발자", department: "개발팀", salary: 3800000, startDate: "2022-06-10", email: "oh@example.com", phone: "010-7890-1234", status: "인턴" },
    { id: 8, name: "홍길동", position: "팀장", department: "경영진", salary: 8000000, startDate: "2015-04-01", email: "hong@example.com", phone: "010-8901-2345", status: "정규직" },
    { id: 9, name: "나은혜", position: "인사담당자", department: "인사팀", salary: 4500000, startDate: "2020-10-15", email: "na@example.com", phone: "010-9012-3456", status: "정규직" },
    { id: 10, name: "임지현", position: "프론트엔드 개발자", department: "개발팀", salary: 5100000, startDate: "2019-11-20", email: "lim@example.com", phone: "010-0123-4567", status: "정규직" },
    { id: 11, name: "최상철", position: "백엔드 개발자", department: "개발팀", salary: 5200000, startDate: "2019-08-15", email: "choi@example.com", phone: "010-1111-2222", status: "정규직" },
    { id: 12, name: "우현우", position: "데이터 분석가", department: "마케팅팀", salary: 5300000, startDate: "2020-02-10", email: "woo@example.com", phone: "010-2222-3333", status: "정규직" },
  ];

  // 클립보드 데이터 읽기
  const onPasteCaptured = (event: React.ClipboardEvent) => {
    if (tabulator) {
      const clipboardData = event.clipboardData.getData('text');
      setSelectedData(`붙여넣기 데이터: ${clipboardData}`);
    }
  };

  // 선택한 셀 복사 함수
  const copySelectedCells = () => {
    if (tabulator) {
      // 범위 선택된 셀이 있는지 확인
      // @ts-ignore
      const cells = tabulator.getSelectedCells();
      
      if (cells && cells.length > 0) {
        // @ts-ignore
        tabulator.copyToClipboard("selected");
        setSelectedData(`선택된 셀: ${cells.length}개 복사됨`);
      } else {
        // 선택된 행 정보 확인
        // @ts-ignore
        const selectedRows = tabulator.getSelectedRows();
        if (selectedRows && selectedRows.length > 0) {
          // @ts-ignore
          tabulator.copyToClipboard("selected");
          setSelectedData(`선택된 행: ${selectedRows.length}개 복사됨`);
        } else {
          setSelectedData("복사할 영역을 먼저 선택해주세요.");
        }
      }
    }
  };

  // 테이블 전체 복사 함수
  const copyEntireTable = () => {
    if (tabulator) {
      // @ts-ignore
      tabulator.copyToClipboard("table");
      setSelectedData(`전체 테이블 복사 (${data.length}행)`);
    }
  };
  
  // 현재 볼 수 있는 데이터만 복사
  const copyVisibleData = () => {
    if (tabulator) {
      // @ts-ignore
      tabulator.copyToClipboard("visible");
      setSelectedData(`현재 보이는 데이터 복사`);
    }
  };

  useEffect(() => {
    if (tableRef.current) {
      // 테이블 초기화
      const table = new Tabulator(tableRef.current, {
        data: data,
        layout: "fitColumns",
        pagination: true,
        paginationSize: 5,
        height: "100%",
        selectable: true,
        selectableRange: true,       // 셀 범위 선택 활성화
        selectableRangeMode: "cell", // cell, row, column 중 cell로 설정
        clipboard: true,
        clipboardCopyRowRange: "selected", // 선택된 행만 복사
        clipboardCopySelector: "selected", // 선택된 셀만 복사
        clipboardCopyStyled: true,
        clipboardPasteAction: "replace",   // 붙여넣기 시 대체
        clipboardCopyConfig: {
          columnHeaders: true,
          rowGroups: false,
          columnCalcs: false,
        },
        // 셀 선택 완료 시 이벤트
        cellSelectionChanged: function(selected, cells) {
          if (selected && cells.length > 0) {
            // 선택 영역 정보 표시
            setSelectedData(`선택된 셀: ${cells.length}개 (${cells[0].getColumn().getField()}부터)`);
          }
        },
        columns: [
          { title: "ID", field: "id", sorter: "number", width: 60 },
          { title: "이름", field: "name", sorter: "string", headerFilter: true },
          { title: "직책", field: "position", sorter: "string", headerFilter: true },
          { title: "부서", field: "department", sorter: "string", headerFilter: true },
          { 
            title: "급여", 
            field: "salary", 
            sorter: "number",
            formatter: "money",
            formatterParams: {
              thousand: ",",
              symbol: "₩",
              precision: 0
            }
          },
          { title: "입사일", field: "startDate", sorter: "date", headerFilter: true },
          { title: "이메일", field: "email", sorter: "string" },
          { title: "전화번호", field: "phone", sorter: "string" },
          { title: "상태", field: "status", sorter: "string", headerFilter: true }
        ],
      });
      
      setTabulator(table);
    }
    
    return () => {
      tabulator?.destroy();
    };
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/gridtest/tabulator2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">클립보드 기능</h1>
          <p className="text-gray-500 mt-1">셀 선택 및 복사 기능 예제입니다. 셀 범위를 드래그하여 선택하세요.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>클립보드 기능</CardTitle>
            <div className="flex space-x-2 mt-2">
              <Button onClick={copySelectedCells} size="sm">
                <Copy className="h-4 w-4 mr-2" />
                선택한 셀 복사
              </Button>
              <Button onClick={copyEntireTable} size="sm" variant="outline">
                <ClipboardCopy className="h-4 w-4 mr-2" />
                전체 테이블 복사
              </Button>
              <Button onClick={copyVisibleData} size="sm" variant="outline">
                <Clipboard className="h-4 w-4 mr-2" />
                보이는 데이터 복사
              </Button>
            </div>
            {selectedData && (
              <div className="mt-2 text-sm text-muted-foreground">
                {selectedData}
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <p className="mb-4 text-sm text-gray-500">
              <strong>사용법:</strong> 마우스로 셀 영역을 선택한 후 복사 버튼을 누르거나 Ctrl+C(Command+C)를 누르세요.
              다른 스프레드시트나 텍스트 편집기에 붙여넣기가 가능합니다.
            </p>
            <div 
              ref={tableRef} 
              className="w-full h-[500px]" 
              onPaste={onPasteCaptured}
              tabIndex={0}
            ></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 