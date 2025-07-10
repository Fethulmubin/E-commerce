import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Expired = () => {
  return (
    <div>
        <h1 className="text-4xl text-red-400 font-semibold">
            Download link Expired
        </h1>
        <Button asChild size='lg'>
            <Link href='/orders'>Get New Link</Link>
        </Button>
    </div>
  )
}

export default Expired