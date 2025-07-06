import React from 'react'

interface FieldConfig {
  type: string
  placeholder: string
  defaultValue?: number
}

interface PlanSectionProps {
  sectionName: string
  sectionData: Record<string, any>
  fieldDefinitions: Record<string, FieldConfig>
  onInputChange: (section: string, key: string, value: any) => void
}

const PlanSection: React.FC<PlanSectionProps> = ({
  sectionName,
  sectionData,
  fieldDefinitions,
  onInputChange,
}) => {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-800'>{sectionName}</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {Object.entries(fieldDefinitions).map(([key, config]) => (
          <div key={key} className='space-y-1'>
            <label className='block text-sm font-medium text-gray-700 capitalize'>
              {key}
            </label>
            <input
              type={config.type}
              className='input'
              placeholder={config.placeholder}
              value={sectionData[key] || ''}
              onChange={(e) => onInputChange(sectionName, key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlanSection
