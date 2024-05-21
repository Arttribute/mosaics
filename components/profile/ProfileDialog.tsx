import React from 'react';
import {  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProfileDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription> Make changes to your profile here.</DialogDescription>
        </DialogHeader>
        <div>
          <div>
            <Label htmlFor='display_name'>Display Name</Label>
            <Input id='display_name' name='display_name'/>
          </div>

        </div>
        <DialogFooter>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
      </DialogContent>



    </Dialog>
  )
}

export default ProfileDialog