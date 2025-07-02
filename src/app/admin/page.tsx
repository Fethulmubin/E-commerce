import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const AdminDashboard = () => {
  return (
    <div className='grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid'>
        <Card>
            <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Desc</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Content</p>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Desc</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Content</p>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Desc</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Content</p>
            </CardContent>
        </Card>
    </div>
  )
}

export default AdminDashboard