import React, { useEffect } from 'react';
import MemberPortal from './portals/member/MemberPortal';
import CouncilPortal from './portals/council/CouncilPortal';
import WarderPortal from './portals/warden/WardenPortal';
import AdminPortal from './portals/admin/AdminPortal';
import { useAuth } from '../context/AuthContext';

const Portal = () => {
    const { role } = useAuth();
    console.log(role);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            {role === 'STUDENT' && <MemberPortal />}
            {role === 'COUNCIL' && <CouncilPortal />}
            {role === 'WARDEN' && <WarderPortal />}
            {role === 'ADMIN' && <AdminPortal />}
        </div>
    );
};

export default Portal;