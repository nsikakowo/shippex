import React, { useEffect, useState } from 'react';
import apiClient from '../../config/apiClient';
import TrackingDetailsPills from '../ui/TrackingDetailsPills';
import {
  LuArrowDownToDot,
  LuArrowUpRight,
  LuDollarSign,
  LuDot,
  LuMapPin,
  LuTruck,
  LuUser,
} from 'react-icons/lu';
import Loader from '../ui/Loader';

interface ShipmentDetails {
  sender: string;
  consignee: string;
  originAddress: string;
  destinationAddress: string;
  shippingService: string;
  codAmount: string;
  timeline: Array<{
    time: string;
    date: string;
    status: string;
    person: string;
    description: string;
  }>;
}

const Tracking: React.FC = () => {
  const [awbId, setAwbId] = useState('');
  const [shipmentDetails, setShipmentDetails] =
    useState<ShipmentDetails | null>(null);
  const [emptyAwb, setemptyAwb] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionlost, setconnectionlost] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setconnectionlost(false);
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setconnectionlost(true);
      setShowNotice(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      const timeoutId = setTimeout(() => setIsOnline(true), 5000);
      return () => clearTimeout(timeoutId);
    }
    // return null;
  }, [isOnline]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAwbId(e.target.value);
  };

  const handleTrackClick = async () => {
    if (!awbId) {
      setemptyAwb(true);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const filterObject = {
        doctype: 'AWB',
        filters: {
          name: ['like', `%${awbId}%`],
        },
      };

      const encodedFilters = encodeURIComponent(JSON.stringify(filterObject));
      const url = `/frappe.client.get?filters=${encodedFilters}`;

      const response = await apiClient.get(url);
      console.log(response);
      setLoading(false);

      // Mock data based on the design
      const mockData: ShipmentDetails = {
        sender: 'Mohamamd Manaa',
        consignee: 'Beshouy Ezzat',
        originAddress: 'Ahmed Hassan\n25, Nile Street, Zamalek\nCairo\nEgypt',
        destinationAddress:
          'Fatima Ali\n10, Corniche Road, Gleem\nAlexandria\nEgypt',
        shippingService: 'Express Service',
        codAmount: '499.55 EGP',
        timeline: [
          {
            time: '12:05PM',
            date: 'Dec 16, 2023',
            status: 'Shipment created',
            person: 'Abdo Saeed',
            description: 'Shipment Description',
          },
          {
            time: '14:05PM',
            date: 'Dec 16, 2023',
            status: 'Shipment picked-up',
            person: 'Beshouy Ezzat',
            description: '',
          },
          {
            time: '14:08PM',
            date: 'Dec 16, 2023',
            status: 'Proof of pick-up',
            person: 'James Collins',
            description: 'Proof of pick-up description',
          },
          {
            time: '12:05PM',
            date: 'Dec 16, 2023',
            status: 'Shipment on delivery',
            person: '',
            description: 'Description goes here',
          },
        ],
      };
      setShipmentDetails(mockData);
    } catch (error: any) {
      setLoading(false);
      setError('Failed to fetch shipment details. Please try again.');
    }
  };

  return (
    <div className="flex flex-col w-full px-[48px] h-screen">
      <div className="w-full bg-secondary mt-[48px] rounded-lg h-[110px] min-h-[110px] flex pt-6 justify-center ">
        <div className="flex flex-col">
          <input
            type="text"
            value={awbId}
            onChange={handleInputChange}
            placeholder="Enter AWB ID"
            className={`w-[600px] mr-6 px-4 h-[46px] py-2 border ${
              emptyAwb
                ? 'border-red-500 shadowDropError '
                : 'border-borderColor  shadowDrop'
            }  
          rounded focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {emptyAwb && (
            <p className="text-red-500 text-sm font-medium mt-2">
              Please enter a valid AWB now
            </p>
          )}
        </div>
        <button
          onClick={handleTrackClick}
          disabled={loading}
          className={`w-[120px] h-[46px] py-2  text-white ${
            loading
              ? 'cursor-not-allowed bg-lightBlue'
              : 'cursor-pointer bg-primary hover:bg-lightBlue'
          }
          rounded  focus:outline-none focus:ring-2 focus:ring-primary`}
        >
          Track
        </button>
      </div>

      <div className="h-full text-gray-500">
        {loading ? (
          <div className="flex h-full justify-center items-center">
            <Loader />
          </div>
        ) : error ? (
          <div className="flex h-full justify-center items-center">
            <img
              onClick={() => {
                setError('');
                setAwbId('');
              }}
              src="/assets/vectors/noresult.png"
              alt="no-result"
              className=" cursor-pointer"
            />
          </div>
        ) : connectionlost ? (
          <div className="flex h-full justify-center items-center">
            <img
              onClick={() => {
                setError('');
                setAwbId('');
              }}
              src="/assets/vectors/offline.png"
              alt="offline"
              className=" cursor-pointer"
            />
          </div>
        ) : shipmentDetails ? (
          <div className="mt-8 flex  gap-4">
            <div className="bg-white pt-6 w-[55%] rounded-lg max-w-[500px] shadowDrop border-borderColor border-[1px]">
              <h2 className="text-lg px-[20px] font-bold text-darkPrimary">
                {awbId}
              </h2>

              <p className="text-iconColor text-sm px-[20px]">
                Last updated: {new Date().toLocaleString()}
              </p>
              <div className="mt-8  pl-[20px] pr-12">
                <TrackingDetailsPills
                  icon={<LuArrowUpRight />}
                  tag="Sender"
                  details={shipmentDetails.sender}
                />
                <TrackingDetailsPills
                  icon={<LuUser />}
                  tag="Consignee"
                  details={shipmentDetails.consignee}
                />
                <TrackingDetailsPills
                  icon={<LuArrowDownToDot />}
                  tag="Origin Address"
                  details={shipmentDetails.originAddress.replace(/\n/g, ', ')}
                />
                <TrackingDetailsPills
                  icon={<LuMapPin />}
                  tag="Destination Address:"
                  details={shipmentDetails.destinationAddress.replace(
                    /\n/g,
                    ', '
                  )}
                />
                <TrackingDetailsPills
                  icon={<LuTruck />}
                  tag="Shipping Service:"
                  details={shipmentDetails.shippingService}
                />
              </div>
              <div className="bg-secondary px-[20px] pt-5 rounded-b-[8px] h-[66px]">
                <TrackingDetailsPills
                  icon={<LuDollarSign />}
                  tag="Total COD Amount"
                  details={shipmentDetails.codAmount}
                />
              </div>
            </div>
            <div className="bg-white p-6 ml-[56px]">
              <h2 className="text-lg  mb-[32px] uppercase font-bold text-darkPrimary">
                Timeline
              </h2>
              <div className="space-y-4">
                {shipmentDetails.timeline.map((event, index) => (
                  <div key={index} className="flex ">
                    <div className="flex flex-col mt-[-15px] w-[110px] text-iconColor mr-4 items-start ">
                      <span className="text-sm font-medium">{event.time}</span>
                      <span className="text-sm mt-2 font-medium ">
                        {event.date}
                      </span>
                    </div>
                    <div className="flex relative flex-col items-start pb-8 border-l-[1px]  border-l-borderColor pl-8 ">
                      <p className="absolute top-[-30px] left-[-26px] ">
                        <LuDot size={50} color="#9CA3AF" />
                      </p>
                      <span className="mt-[-17px] font-semibold text-darkPrimary">
                        {event.status}
                      </span>
                      <p className="font-medium text-iconColor  my-2">
                        {event.description}
                      </p>
                      <span className="font-semibold text-darkPrimary ">
                        {event.person}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full justify-center items-center">
            <div className="">
              <img src="/assets/vectors/empty.svg" alt="empty" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
