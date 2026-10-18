import React, { useState } from 'react'

export default function EventImage({ src, className = '', eager = false }) {
  const [failedSource, setFailedSource] = useState(null)
  return (
    <div className={`event-image ${className}`}>
      {src && failedSource !== src
        ? <img src={src} alt="" loading={eager ? 'eager' : 'lazy'} onError={() => setFailedSource(src)} />
        : <span>Gather live</span>}
    </div>
  )
}
