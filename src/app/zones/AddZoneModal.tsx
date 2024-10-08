'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader, Plus } from 'lucide-react'
import { toast } from 'sonner'
import Select from 'react-select'
import { addZone, getZoneLeaders } from '@/app/actions/zones'

interface ZoneLeader {
  value: string
  label: string
}

export function AddZoneModal({ onZoneAdded }: { onZoneAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [zoneName, setZoneName] = useState('')
  const [zoneLocation, setZoneLocation] = useState('')
  const [selectedLeader, setSelectedLeader] = useState<ZoneLeader | null>(null)
  const [zoneLeaderOptions, setZoneLeaderOptions] = useState<ZoneLeader[]>([])
  const [shouldFetchLeaders, setShouldFetchLeaders] = useState(false)

  const { execute: executeAddZone, status: addZoneStatus, result: addZoneResult, reset: resetAddZone } = useAction(addZone)
  const { execute: executeGetZoneLeaders, status: getZoneLeadersStatus, result: zoneLeadersResult } = useAction(getZoneLeaders)

  useEffect(() => {
    if (isOpen && shouldFetchLeaders) {
      executeGetZoneLeaders()
      setShouldFetchLeaders(false)
    }
  }, [isOpen, shouldFetchLeaders, executeGetZoneLeaders])

  useEffect(() => {
    if (zoneLeadersResult?.data) {
      const options = zoneLeadersResult.data.map((leader: { member_id: string; firstname: string; lastname: string }) => ({
        value: leader.member_id,
        label: `${leader.firstname} ${leader.lastname}`
      }))
      setZoneLeaderOptions(options)
    }
  }, [zoneLeadersResult])

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!zoneName || !zoneLocation || !selectedLeader) {
    toast.error('Please fill in all fields')
    return
  }

   executeAddZone({
    zone_name: zoneName,
    zone_leader_id: selectedLeader.value,
    zone_location: zoneLocation
  })
}

const handleActionComplete = useCallback(() => {
  if (addZoneResult?.data?.success) {
    toast.success('Zone added successfully')
    setIsOpen(false)
    setZoneName('')
    setZoneLocation('')
    setSelectedLeader(null)
    onZoneAdded()
    resetAddZone()  
  } else if (addZoneResult?.data?.message) {
    toast.error(addZoneResult.data.message)
    resetAddZone()
  }
}, [addZoneResult, onZoneAdded, resetAddZone])

useEffect(() => {
  if (addZoneStatus === 'hasSucceeded') {
    handleActionComplete()
  } else if (addZoneStatus === 'hasErrored') {
    toast.error('An error occurred while adding the zone')
    resetAddZone()  
  }
}, [addZoneStatus, handleActionComplete, resetAddZone])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setShouldFetchLeaders(true)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-600 text-white hover:bg-yellow-700">
          <Plus className="mr-2 h-4 w-4" /> Add Zone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Zone</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="zone_name">Zone Name</Label>
            <Input
              id="zone_name"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              placeholder="Enter zone name"
            />
          </div>
          <div>
            <Label htmlFor="zone_location">Zone Location</Label>
            <Input
              id="zone_location"
              value={zoneLocation}
              onChange={(e) => setZoneLocation(e.target.value)}
              placeholder="Enter zone location"
            />
          </div>
          <div>
            <Label htmlFor="zone_leader">Zone Leader</Label>
            <Select
              id="zone_leader"
              options={zoneLeaderOptions}
              value={selectedLeader}
              onChange={(newValue) => setSelectedLeader(newValue as ZoneLeader)}
              placeholder="Select zone leader"
              isLoading={getZoneLeadersStatus === 'executing'}
              isDisabled={getZoneLeadersStatus === 'executing'}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-yellow-600 text-white hover:bg-yellow-700"
            disabled={addZoneStatus === 'executing' || getZoneLeadersStatus === 'executing'}
          >
            {addZoneStatus === 'executing' ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Adding Zone...
              </>
            ) : (
              'Add Zone'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}