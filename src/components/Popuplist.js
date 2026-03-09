import React, { useRef, useState, useEffect } from 'react';
import ReportUser from './ReportUser';
import { EllipsisVertical } from 'lucide-react';

export default function Popuplist({ children, user, handler }) {
    const [isOpen, setIsOpen] = useState(false); 
    const ref = useRef(null);

    const togglePopuplist = () => {
        setIsOpen(prevState => !prevState);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='size-8 relative mt-4  bg-white'>
            <button className='w-full flex items-center rounded-full justify-center cursor-pointer' onClick={togglePopuplist}>
                <EllipsisVertical />
            </button>

            <div ref={ref} className={`bg-white items-center justify-center absolute z-[9] min-w-[140px] rounded-lg top-7 right-0 border shadow-lg ${isOpen ? '' : 'hidden'}`}>
                {children}
            </div>
            {/* Uncomment and implement as needed
            {report && <ReportUser cancelHandler={setReport} successHandler={reportUserHandler} loading={loading} />} */}
        </div>
    );
}
