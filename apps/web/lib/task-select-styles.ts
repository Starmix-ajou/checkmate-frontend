import { Task } from '@cm/types/project'
import { StylesConfig } from 'react-select'

export const taskSelectStyles: StylesConfig<Task, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: 'var(--background)',
    borderColor: state.isFocused ? 'var(--ring)' : 'var(--input)',
    borderWidth: '1px',
    borderRadius: '0.5rem',
    minHeight: '2.25rem',
    boxShadow: state.isFocused
      ? '0 0 0 2px var(--ring/20), 0 0 0 4px var(--ring/10)'
      : '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '&:hover': {
      borderColor: state.isFocused ? 'var(--ring)' : 'var(--input)',
    },
    transition: 'all 0.2s ease',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    boxShadow:
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    zIndex: 50,
    overflow: 'hidden',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? 'var(--accent)'
      : state.isSelected
        ? 'var(--primary)'
        : 'transparent',
    color: state.isSelected
      ? 'var(--primary-foreground)'
      : state.isFocused
        ? 'var(--accent-foreground)'
        : 'var(--foreground)',
    '&:hover': {
      backgroundColor: state.isSelected ? 'var(--primary)' : 'var(--accent)',
      color: state.isSelected
        ? 'var(--primary-foreground)'
        : 'var(--accent-foreground)',
    },
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }),
  input: (base) => ({
    ...base,
    color: 'var(--foreground)',
    fontSize: '0.875rem',
    padding: '0.125rem 0',
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--foreground)',
    fontSize: '0.875rem',
  }),
  clearIndicator: (base, state) => ({
    ...base,
    color: 'var(--muted-foreground)',
    padding: '0.25rem',
    transition: 'all 0.15s ease',
    '&:hover': {
      color: 'var(--destructive)',
    },
    opacity: state.isFocused ? 1 : 0.7,
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: 'var(--muted-foreground)',
    padding: '0.25rem',
    transition: 'all 0.15s ease',
    '&:hover': {
      color: 'var(--foreground)',
    },
    opacity: state.isFocused ? 1 : 0.7,
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0.25rem 0.5rem',
  }),
  indicatorsContainer: (base) => ({
    ...base,
    padding: '0 0.25rem',
  }),
} 