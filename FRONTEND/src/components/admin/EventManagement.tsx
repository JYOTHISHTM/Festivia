import Sidebar from "../../components/layout/admin/SideBar";

function CreatorManagement() {
  const eventCards = [
    { id: 1, eventsCount: '04', avgRating: '3.8' },
    { id: 2, eventsCount: '04', avgRating: '3.8' },
    { id: 3, eventsCount: '04', avgRating: '3.8' }
  ];

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 p-6 bg-gray-100 min-h-screen font-sans">
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="bg-white  rounded-lg p-5 shadow-lg flex-1 max-w-xs">
            <p className="text-gray-700 text-sm font-medium tracking-wide mb-2">TOTAL NO OF CREATORS</p>
            <div className="flex items-center">
              <span className="text-3xl font-bold mr-3">345</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-medium">+2%</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-lg flex-1 max-w-xs">
            <p className="text-gray-700 text-sm font-medium tracking-wide mb-2">TOTAL NO OF BLOCKED CREATORS</p>
            <div className="flex items-center">
              <span className="text-3xl font-bold">45</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-200 p-5 rounded-lg mb-8 shadow-md">
          <div className="flex flex-wrap gap-3">
            <button className="bg-black text-white px-4 0 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">search</button>
            <button className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">subcrition type</button>
            <button className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">blocked</button>
            <button className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">upcoming</button>
            <button className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">past</button>
          </div>
        </div>

        <div className="space-y-5">
          {eventCards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg p-5 flex items-center shadow-lg hover:shadow-xl transition-shadow duration-300">


              <div className="w-24 h-24 rounded-lg overflow-hidden mr-6 shadow-md">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 via-red-500 to-orange-500"></div>
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-lg">NEW EVENT MANAGEMENT</h3>
                  <div className="flex items-center space-x-3">
                    <span className="bg-black text-white text-xs px-3 py-1 rounded-md font-medium">NO OF EVENT CONDUCTED</span>
                    <span className="text-sm font-medium">{card.eventsCount}</span>
                    <button className="bg-black text-white text-xs px-4 py-1.5 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200">VIEW PROFILE</button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-1.5">
                    <span className="bg-black text-white text-xs px-2.5 py-1 rounded-md font-medium">SUBSCRIPTION</span>
                    <span className="bg-teal-300 text-xs px-2.5 py-1 rounded-md font-medium">PREMIUM</span>
                  </div>
                  
                  <div className="flex items-center space-x-1.5">
                    <span className="bg-black text-white text-xs px-2.5 py-1 rounded-md font-medium">AVG RATING</span>
                    <span className="text-xs font-medium">{card.avgRating}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1.5">
                    <span className="bg-black text-white text-xs px-2.5 py-1 rounded-md font-medium">SUBSCRIPTION</span>
                    <span className="bg-teal-300 text-xs px-2.5 py-1 rounded-md font-medium">PREMIUM</span>
                  </div>
                  
                  <div className="flex items-center space-x-1.5">
                    <span className="bg-black text-white text-xs px-2.5 py-1 rounded-md font-medium">BLOCKED</span>
                    <span className="bg-green-400 text-xs px-2.5 py-1 rounded-md font-medium">NO</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreatorManagement;


