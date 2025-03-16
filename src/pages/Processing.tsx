import PageHeader from '@/components/mycomponents/PageHeader'
import Layout from '@/components/mycomponents/wrappers/Layout'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const Processing = () => {
    const { arrival_number } = useParams()
    const [isScanning, setIsScanning] = useState(false)

    const handleScan = () => {
        setIsScanning(true)

        setTimeout(() => {
            setIsScanning(false)
        }, 3000)
    }
    return (
        <Layout>
            <div className="flex flex-col min-h-full p-2">
                <PageHeader
                    title={`Processing ${arrival_number}`}
                    description="Processing the arrival"
                    actionLabel="Finish Processing"
                    onAction={() => {}}
                />

                <div className="flex justify-between items-center h-[90vh] mt-4">
                    {/* processed  */}
                    <div className="h-full bg-white rounded-lg p-4 w-5/12">1</div>
                    {/* scan area  */}
                    <div className="h-full w-2/12 p-4 my-auto flex justify-center items-center flex-col gap-4">
                        <div
                            className="w-64 h-64 bg-gray-200"
                            style={
                                isScanning
                                    ? {
                                          backgroundImage: `url('/Scanner.gif')`,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                          backgroundRepeat: 'no-repeat'
                                      }
                                    : {}
                            }></div>
                        <Button className='w-full' onClick={handleScan}>{isScanning ? 'Scanning...' : 'Scan'}</Button>
                    </div>
                    {/* products to scan  */}
                    <div className="h-full w-5/12 bg-white rounded-lg p-4">3</div>
                </div>
            </div>
        </Layout>
    )
}

export default Processing
