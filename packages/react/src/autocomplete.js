/**
 * React wrappers for ytz-autocomplete Web Components.
 * Text input with filterable dropdown selection.
 *
 * @module @yetzirah/react/autocomplete
 */

import '@yetzirah/core'
import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

/**
 * Autocomplete container with input and options.
 *
 * @param {Object} props
 * @param {string|string[]} [props.value] - Controlled selected value(s)
 * @param {Function} [props.onChange] - Called when selection changes (value) => void
 * @param {Function} [props.onInputChange] - Called when input text changes (inputValue) => void
 * @param {Array<{value: string, label: string, disabled?: boolean}>} [props.options] - Options array
 * @param {boolean} [props.multiple] - Enable multi-select mode
 * @param {boolean} [props.loading] - Show loading state
 * @param {boolean} [props.filter] - Enable local filtering (default true)
 * @param {string} [props.placeholder] - Input placeholder
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} [props.loadingContent] - Custom loading content
 * @param {React.ReactNode} [props.children] - Option children (alternative to options prop)
 * @param {React.Ref} ref
 *
 * @example
 * const [value, setValue] = useState('')
 * <Autocomplete
 *   value={value}
 *   onChange={setValue}
 *   options={[
 *     { value: 'apple', label: 'Apple' },
 *     { value: 'banana', label: 'Banana' }
 *   ]}
 *   placeholder="Search fruits..."
 * />
 *
 * @example
 * // Multi-select
 * const [selected, setSelected] = useState([])
 * <Autocomplete
 *   multiple
 *   value={selected}
 *   onChange={setSelected}
 *   options={tags}
 * />
 */
export const Autocomplete = forwardRef(function Autocomplete(
  {
    value,
    onChange,
    onInputChange,
    options,
    multiple,
    loading,
    filter = true,
    placeholder,
    className,
    loadingContent = 'Loading...',
    children,
    ...props
  },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Sync controlled value
  useEffect(() => {
    const el = innerRef.current
    if (!el || value === undefined) return
    el.value = value
  }, [value])

  // Set options when prop changes
  useEffect(() => {
    const el = innerRef.current
    if (!el || !options) return
    // Check if setOptions is available (element must be initialized)
    if (typeof el.setOptions === 'function') {
      el.setOptions(options)
    }
  }, [options])

  // Event listeners
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    const handleChange = (e) => onChange?.(e.detail.value)
    const handleInputChange = (e) => onInputChange?.(e.detail.value)

    el.addEventListener('change', handleChange)
    el.addEventListener('input-change', handleInputChange)
    return () => {
      el.removeEventListener('change', handleChange)
      el.removeEventListener('input-change', handleInputChange)
    }
  }, [onChange, onInputChange])

  return (
    <ytz-autocomplete
      ref={innerRef}
      class={className}
      multiple={multiple || undefined}
      loading={loading || undefined}
      filter={filter ? undefined : 'false'}
      {...props}
    >
      <input slot="input" placeholder={placeholder} />
      <span slot="loading">{loadingContent}</span>
      {children}
    </ytz-autocomplete>
  )
})

/**
 * Option for Autocomplete.
 *
 * @param {Object} props
 * @param {string} props.value - Option value
 * @param {boolean} [props.disabled] - Option not selectable
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Option label
 * @param {React.Ref} ref
 *
 * @example
 * <Autocomplete>
 *   <Option value="red">Red</Option>
 *   <Option value="green" disabled>Green (unavailable)</Option>
 * </Autocomplete>
 */
export const Option = forwardRef(function Option(
  { value, disabled, className, children, ...props },
  ref
) {
  return (
    <ytz-option
      ref={ref}
      value={value}
      class={className}
      disabled={disabled || undefined}
      {...props}
    >
      {children}
    </ytz-option>
  )
})
