import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import ProofGeneratorInator from '../components/ProofGeneratorInator';
import ContractInteractor from '../components/ContractInteractor';
import KycButton from '../components/KycButton';
import { Button } from '../components/ui/button';

function Verification() {  
  const [user, setUser] = useState<any>(null);
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [proof, setProof] = useState<any>(null);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google/login';
  }

  async function getUserProfile() {
    const res = await axiosInstance.get('/user/profile');
    console.log("res.data", res.data);
    setUser(res.data);
  }

  async function logOut() {
    const res = await axiosInstance.post('/auth/signout');
    console.log("res.data", res.data);
    setUser(null);
    setKycStatus(null);
    setProof(null);
  }

  async function getKycStatus() {
    const res = await axiosInstance.get('/sumsub/kyc-status');
    console.log("res.data", res.data);
    setKycStatus(res.data);
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      getKycStatus();
    }
  }, [user]);

  return (
    <div className='p-4 flex flex-col gap-4 mx-auto'>
      {!user ? <Button onClick={handleGoogleLogin} >Login with Google</Button> : <Button onClick={logOut} >Log Out</Button>}
      {user && 
        <div className='flex space-y-2 flex-col items-center justify-center'>
          <div>{user.firstName} {user.lastName}</div>
          <div>{user.email}</div>
          <img src={user.avatarUrl} alt="Profile" />
          {kycStatus && kycStatus.list && kycStatus.list.items && kycStatus.list.items.length > 0 ? (
            <div className="p-4 border rounded-lg max-w-md">
              <h3 className="text-lg font-bold mb-3">KYC Information</h3>
              
              <div className="mb-3">
                <h4 className="font-semibold">Personal Information</h4>
                <p>Name: {kycStatus.list.items[0].info.firstName} {kycStatus.list.items[0].info.lastName}</p>
                <p>Date of Birth: {kycStatus.list.items[0].info.dob}</p>
                <p>Nationality: {kycStatus.list.items[0].info.nationality}</p>
                <p>Gender: {kycStatus.list.items[0].info.gender}</p>
              </div>
              
              {kycStatus.list.items[0].info.idDocs && kycStatus.list.items[0].info.idDocs.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-semibold">Document Information</h4>
                  <p>Type: {kycStatus.list.items[0].info.idDocs[0].idDocType}</p>
                  <p>Number: {kycStatus.list.items[0].info.idDocs[0].number}</p>
                  <p>Issued Date: {kycStatus.list.items[0].info.idDocs[0].issuedDate}</p>
                  <p>Valid Until: {kycStatus.list.items[0].info.idDocs[0].validUntil}</p>
                </div>
              )}
              
              {kycStatus.list.items[0].review && (
                <div className="mb-3">
                  <h4 className="font-semibold">Verification Status</h4>
                  <p>Status: {kycStatus.list.items[0].review.reviewStatus}</p>
                  <p>Result: {kycStatus.list.items[0].review.reviewResult.reviewAnswer}</p>
                  <p>Review Date: {kycStatus.list.items[0].review.reviewDate}</p>
                </div>
              )}
            <ProofGeneratorInator proof={proof} setProof={setProof} />
            {
                /**
                 * 
                proof &&
                <div className='mt-4'>
                <ContractInteractor proof={proof} />
                </div>
                */
            }
            </div>
          ): <KycButton />}
        </div>
      }
    </div>
  )
}

export default Verification
