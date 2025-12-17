/**
 * React wrappers for ytz-tabs Web Components.
 * Provides controlled/uncontrolled tab selection.
 *
 * @module @yetzirah/react/tabs
 */

import '@yetzirah/core'
import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

/**
 * Tabs container component.
 *
 * @param {Object} props
 * @param {string} [props.value] - Controlled selected panel id
 * @param {string} [props.defaultValue] - Initial selected panel id (uncontrolled)
 * @param {Function} [props.onChange] - Callback when selection changes
 * @param {'horizontal'|'vertical'} [props.orientation='horizontal'] - Tab orientation
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Tab and TabPanel elements
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * <Tabs value={tab} onChange={setTab}>
 *   <Tab panel="one">Tab 1</Tab>
 *   <Tab panel="two">Tab 2</Tab>
 *   <TabPanel id="one">Content 1</TabPanel>
 *   <TabPanel id="two">Content 2</TabPanel>
 * </Tabs>
 */
export const Tabs = forwardRef(function Tabs(
  { value, defaultValue, onChange, orientation, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Sync controlled value prop to attribute
  useEffect(() => {
    const el = innerRef.current
    if (!el || value === undefined) return
    el.setAttribute('value', value)
  }, [value])

  // Handle change events
  useEffect(() => {
    const el = innerRef.current
    if (!el || !onChange) return

    const handleChange = (e) => onChange(e.detail.value)

    el.addEventListener('change', handleChange)
    return () => el.removeEventListener('change', handleChange)
  }, [onChange])

  return (
    <ytz-tabs
      ref={innerRef}
      class={className}
      value={defaultValue || undefined}
      orientation={orientation}
      {...props}
    >
      {children}
    </ytz-tabs>
  )
})

/**
 * Tab button component.
 *
 * @param {Object} props
 * @param {string} props.panel - ID of the TabPanel this tab controls (required)
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Tab label
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 */
export const Tab = forwardRef(function Tab(
  { panel, className, children, ...props },
  ref
) {
  return (
    <ytz-tab ref={ref} class={className} panel={panel} {...props}>
      {children}
    </ytz-tab>
  )
})

/**
 * TabPanel content component.
 *
 * @param {Object} props
 * @param {string} props.id - Panel ID matching a Tab's panel prop (required)
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} props.children - Panel content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 */
export const TabPanel = forwardRef(function TabPanel(
  { id, className, children, ...props },
  ref
) {
  return (
    <ytz-tabpanel ref={ref} id={id} class={className} {...props}>
      {children}
    </ytz-tabpanel>
  )
})
