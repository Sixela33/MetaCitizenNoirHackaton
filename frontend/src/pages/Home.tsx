import { Button } from '../components/ui/button'
import { Shield } from 'lucide-react'
import IDCard from '../assets/ID.png'
import { Link } from 'react-router-dom'

export default function Home() {

  return (
    <div className="p-6 max-w-7xl ">
      <div className="flex justify-between items-center mb-8 text-center w-full flex justify-center">
        <div>
          <h1 className="text-3xl font-bold">MetaCitizen Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            On-chain KYC and AML compliance with zero-knowledge proofs
          </p>
          <p className="text-muted-foreground mt-1">
            Protect your users' privacy and security with our on-chain KYC and AML compliance solution.
          </p>
        </div>
      </div>
        <div className='w-full flex justify-center items-center'>
          <img src={IDCard} alt="ID Card" className="w-1/2" />
        </div>
        <Link to="/templates">
          <Button className="flex items-center gap-2 w-full">
            <Shield className="h-4 w-4" />
            Generate New Registry
        </Button>
        </Link>
    </div>
  )
}
