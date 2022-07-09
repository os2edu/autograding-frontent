import React, { useState } from 'react'
import { Input, Space, Select } from 'antd'

export interface ISearchProps {
  name: string
  assignment: string
  language: string[]
}

const { Search } = Input
const { Option } = Select

interface IProps {
    defaultQuery: Partial<ISearchProps>;
    onChange: (query: Partial<ISearchProps>) => void;
    noLang?: boolean;
}

const SearchList = (props: Partial<IProps>) => {
  const [query, setQuery] = useState<Partial<ISearchProps>>(props.defaultQuery || {})
    const onChange = (key: keyof ISearchProps, v: string | string[]) => {
        console.log(key, v)
      const newQuery = { ...query, [key]: v }
      setQuery(newQuery)
      props.onChange?.(newQuery)
    }
    return (
      <Space size={60} style={{ marginBottom: 20 }}>
        <Search
          value={query.name}
          placeholder="Name"
          onChange={(e) => onChange('name', e.target.value.trim())}
          // onSearch={(v) => onSearch('name', v)}
          style={{ width: 200 }}
        />
        {/* <Search
          value={query.assignment}
          placeholder="Assignment"
          onChange={(e) => onChange('assignment', e.target.value.trim())}
          // onSearch={(v) => onSearch('assignment', v)}
          style={{ width: 200 }}
        /> */}
        {!props.noLang && 
        <Select
          mode="multiple"
          allowClear
          style={{ width: 200 }}
          placeholder="Language"
          onChange={(v: string[]) => onChange('language', v)}
        >
          {['Rust', 'C', 'C++', 'Go'].map((l) => (
            <Option key={l}>{l}</Option>
          ))}
        </Select>
        }
      </Space>
    )

}

export default SearchList
