import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogIn, Wheat } from 'lucide-react'
import { User } from '@supabase/supabase-js'

interface UserActionsProps {
  user: User | null
  getUserInitials: () => string
  handleLogin: () => void
  navigateToVendorOnboarding: () => void
}

const UserActions = ({
  user,
  getUserInitials,
  handleLogin,
  navigateToVendorOnboarding,
}: UserActionsProps) => {
  if (user) {
    return (
      <div className="flex items-center">
        <Avatar className="h-8 w-8 hidden md:flex">
          <AvatarImage src="" />
          <AvatarFallback className="bg-market-green text-white">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </div>
    )
  }

  return (
    <div className="hidden md:flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogin}
        className="items-center"
      >
        <LogIn className="mr-1 h-4 w-4" />
        <span>Login</span>
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={navigateToVendorOnboarding}
        className="bg-market-green hover:bg-market-green-dark items-center"
      >
        <Wheat className="mr-1 h-4 w-4" />
        <span>Join as a Vendor</span>
      </Button>
    </div>
  )
}

export default UserActions
