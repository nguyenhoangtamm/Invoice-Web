import React, { useState, useEffect } from 'react';
import { Input, InputGroup, Button, SelectPicker, DateRangePicker } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import CloseIcon from '@rsuite/icons/Close';

export interface SearchFilter {
  field: string;
  type: 'text' | 'select' | 'dateRange';
  label: string;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
}

export interface SearchParams {
  [key: string]: any;
}

interface Props {
  filters: SearchFilter[];
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
  placeholder?: string;
}

export default function AdminSearchBar({ filters, onSearch, loading, placeholder = "Tìm kiếm..." }: Props) {
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [quickSearch, setQuickSearch] = useState('');

  const handleQuickSearch = () => {
    if (quickSearch.trim()) {
      onSearch({ quickSearch: quickSearch.trim() });
    }
  };

  const handleAdvancedSearch = () => {
    const params = Object.keys(searchParams).reduce((acc, key) => {
      if (searchParams[key] !== null && searchParams[key] !== undefined && searchParams[key] !== '') {
        acc[key] = searchParams[key];
      }
      return acc;
    }, {} as SearchParams);
    onSearch(params);
  };

  const handleClearSearch = () => {
    setQuickSearch('');
    setSearchParams({});
    onSearch({});
  };

  const handleQuickSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickSearch();
    }
  };

  const updateSearchParam = (field: string, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      {/* Quick Search */}
      <div className="flex gap-2 mb-4">
        <InputGroup className="flex-1">
          <Input
            placeholder={placeholder}
            value={quickSearch}
            onChange={setQuickSearch}
            onKeyDown={handleQuickSearchKeyDown}
          />
          <InputGroup.Addon>
            <SearchIcon />
          </InputGroup.Addon>
        </InputGroup>
        <Button
          appearance="primary"
          onClick={handleQuickSearch}
          loading={loading}
          disabled={!quickSearch.trim()}
        >
          Tìm kiếm
        </Button>
        <Button
          appearance="subtle"
          onClick={handleClearSearch}
          startIcon={<CloseIcon />}
        >
          Xóa bộ lọc
        </Button>
      </div>

      {/* Advanced Filters */}
      {filters.length > 0 && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            {filters.map((filter) => (
              <div key={filter.field} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                {filter.type === 'text' && (
                  <Input
                    placeholder={filter.placeholder}
                    value={searchParams[filter.field] || ''}
                    onChange={(value) => updateSearchParam(filter.field, value)}
                  />
                )}
                {filter.type === 'select' && (
                  <SelectPicker
                    data={filter.options || []}
                    placeholder={filter.placeholder || `Chọn ${filter.label.toLowerCase()}`}
                    value={searchParams[filter.field]}
                    onChange={(value) => updateSearchParam(filter.field, value)}
                    cleanable
                    searchable={false}
                    style={{ width: '100%' }}
                  />
                )}
                {filter.type === 'dateRange' && (
                  <DateRangePicker
                    placeholder={filter.placeholder || 'Chọn khoảng thời gian'}
                    value={searchParams[filter.field]}
                    onChange={(value) => updateSearchParam(filter.field, value)}
                    cleanable
                    style={{ width: '100%' }}
                  />
                )}
              </div>
            ))}
          </div>
          <Button
            appearance="primary"
            onClick={handleAdvancedSearch}
            loading={loading}
          >
            Tìm kiếm nâng cao
          </Button>
        </div>
      )}
    </div>
  );
}