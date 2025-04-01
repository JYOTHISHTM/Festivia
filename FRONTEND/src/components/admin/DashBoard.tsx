import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Sidebar from "../../components/layout/admin/SideBar";

const EventDashboard = () => {
    
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  
  const metrics = [
    { title: "NO. EVENT CREATORS", value: "345", trend: "+20%" },
    { title: "TOTAL NO OF USERS", value: "345", trend: "+15%" },
    { title: "TOTAL EARNINGS/TICKET", value: "345", trend: "+20%" },
    { title: "TOTAL EARNINGS/SUBSCRIPTION", value: "345", trend: "+20%" }
  ];
  
  const transactions = [
    { name: "Domestic Events", amount: "$1000", status: "paid", date: "18 Jun 2020", role: "Creator" },
    { name: "Domestic Events", amount: "$1000", status: "paid", date: "18 Jun 2020", role: "User" },
    { name: "Domestic Events", amount: "$1000", status: "paid", date: "18 Jun 2020", role: "Creator" },
    { name: "Domestic Events", amount: "$1000", status: "paid", date: "18 Jun 2020", role: "Creator" },
    { name: "Domestic Events", amount: "$1000", status: "paid", date: "18 Jun 2020", role: "User" },
    { name: "Domestic Events", amount: "$1000", status: "paid", date: "18 Jun 2020", role: "Creator" },
    { name: "Domestic Events", amount: "$1000", status: "paid", date: "18 Jun 2020", role: "Creator" }
  ];
  
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      <div className="w-14  inset-y-0 z-10">
        <Sidebar />
      </div>
      
      <div className="ml-64 w-full p-6">


        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase">{metric.title}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">{metric.trend}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-medium">Recent Transactions</div>
        </div>
        
        <div className="flex mb-6">
          <div className="flex space-x-2">
            <button className="px-8 py-4 bg-black text-white rounded text-sm">Ticket</button>
            <button className="px-4 py-4 bg-black text-white rounded text-sm">Subscription</button>
            

            <div className="relative">
              <button 
                className="px-8 py-4 bg-black text-white rounded text-sm flex items-center"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              >
                Role <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {roleDropdownOpen && (
                <div className="absolute z-10 mt-1 w-36 bg-white border border-gray-200 rounded shadow-lg">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Creator</button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">User</button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">All</button>
                </div>
              )}
            </div>
            

            <button className="px-8 py-1 bg-black text-white rounded text-sm">Status</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-4 mb-6">


              <div className="relative">
                <button 
                  className="px-4 py-1 bg-gray-200 text-gray-700 rounded text-sm flex items-center"
                  onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                >
                  MONTHLY <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {timeDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-36 bg-white border border-gray-200 rounded shadow-lg">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">DAILY</button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">WEEKLY</button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">MONTHLY</button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">YEARLY</button>
                  </div>
                )}
              </div>
              
              <div className="w-16 h-6 bg-blue-500"></div>
              <div className="text-sm">TICKETS</div>
              <div className="w-16 h-6 bg-teal-400"></div>
              <div className="text-sm">SUBSCRIPTION</div>
            </div>
            
            <div className="flex h-64 items-end space-x-8 mt-8 px-8">

              <div className="flex space-x-2 items-end">
                <div className="w-12 bg-blue-500" style={{ height: '130px' }}></div>
                <div className="w-12 bg-teal-400" style={{ height: '90px' }}></div>
              </div>
              

              <div className="flex space-x-2 items-end">
                <div className="w-12 bg-blue-500" style={{ height: '200px' }}></div>
                <div className="w-12 bg-teal-400" style={{ height: '110px' }}></div>
              </div>
              

              <div className="flex space-x-2 items-end">
                <div className="w-12 bg-blue-500" style={{ height: '130px' }}></div>
                <div className="w-12 bg-teal-400" style={{ height: '160px' }}></div>
              </div>
            </div>
            

            <div className="grid grid-cols-9 mt-4">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="text-xs text-gray-500">$100</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;