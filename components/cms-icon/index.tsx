import DOMPurify from 'isomorphic-dompurify'

type CMSIconProps = {
  icon: string
}

export const CMSIcon = ({ icon }: CMSIconProps) => {
  const clean = DOMPurify.sanitize(icon, { USE_PROFILES: { svg: true, svgFilters: true } })
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: clean,
      }}
    />
  )
}
