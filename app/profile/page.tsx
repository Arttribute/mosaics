import React from 'react'
import ProfileDialog from '@/components/profile/ProfileDialog'
import ProfileImage from '@/components/profile/ProfileImage'
import { Button } from '@/components/ui/button'

const profile = {
    user_id: 23 ,
    first_name: "Kendi",
    last_name: "Njeru" ,
    display_name: "ken02" ,
    avatar: "https://github.com/shadcn.png",
    achievements: [
      {
        id: 121,
        achievement_name: "Top Score",
        achievement_description: "Achieved the highest score in a game" ,
        achievement_image: "https://github.com/shadcn.png",
        created_at: "2024-06-06 08:30:00"
    
      },
      {
        id: 14,
        achievement_name: "5 Day Streak" ,
        achievement_description: "Played a game on the app for 5 consecutive days",
        achievement_image: "https://github.com/shadcn.png",
        created_at: "2024-06-06 08:30:00"
      },
      {
        id: 31,
        achievement_name: "10 day Streak",
        achievement_description: "Played a game on the app for 5 consecutive days",
        achievement_image: "https://github.com/shadcn.png",
        created_at: "2024-06-06 06:30:00"
      },
      {
        id: 21,
        achievement_name: "Frank Rubin ",
        achievement_description: "You completed your first puzzle" ,
        achievement_image: "https://github.com/shadcn.png",
        created_at: "2024-06-02 08:30:00"
    
      },
      {
        id: 15,
        achievement_name: "About to have some fun ",
        achievement_description: "You logged in for the first time" ,
        created_at: "2024-06-01 08:30:00"
    
      },
    ]
  }



const page = () => {
  return (
    <div className='w-full content-center flex flex-col gap-6 mt-4 justify-center'>
      <div className='flex flex-col w-full gap-2 pt-4 content-center items-center '>
      <ProfileImage />
      <div>
        <h2 className='font-bold'>{profile.first_name} {profile.last_name}</h2>
      </div>
      <ProfileDialog />
    </div>

    <div className='flex flex-col content-center items-center px-auto'>
      <h2 className='font-semibold gap-1.5'>Your Achievements &gt </h2>
      <div className="flex flex-col gap-2.5">

        {profile.achievements.map((achievement) => (
          <div key={achievement.id} className='flex items-center space-x-2 rounded-md border p-4 hover:bg-blend-darken gapy-2'>
              <div>
                  <img src={achievement.achievement_image} alt="" className="h-8 w-8"/>
              </div>
              <div className=''>
                <h3 className='font-medium'>{achievement.achievement_name}</h3>
                <p className="italic">{achievement.achievement_description}</p>
              </div>
              {/* <div className='self-end justify-self-end content-center'>
              <p className='text-xs '>{
                Date(achievement.created_at)}
              </p>
              </div> */}
          </div>
        ))}

        
      </div>

    </div>

    <div className='flex content-center items-center justify-center px-auto'>
      <Button variant="ghost">View Achievements </Button>
    </div>
    </div>

  )
}

export default page