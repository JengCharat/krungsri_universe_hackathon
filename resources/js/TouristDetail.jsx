import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function TouristDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedDetails = location.state?.details || null;
  const [details, setDetails] = useState(passedDetails);
  const { id } = useParams();

  // ฟอร์มสร้าง trip
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [conditions, setConditions] = useState("");
  const [maxPeople, setMaxPeople] = useState(1);
  const [travelOption, setTravelOption] = useState("none"); // ค่าเริ่มต้น: ไม่ต้องการเลย
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!passedDetails) {
      async function fetchDetail() {
        try {
          const response = await axios.get(`/api/tourist-attractions/${id}`);
          setDetails([response.data]);
        } catch (error) {
          console.error("Error fetching detail:", error);
        }
      }
      fetchDetail();
    }
  }, [id, passedDetails]);

  if (!details) return <p>Loading...</p>;

  const allImages = details.flatMap((detail) => {
    const mainImage = detail.image
      ? [detail.image.startsWith("http") ? detail.image : "/uploads/" + detail.image]
      : [];
    const additionalImages = detail.images
      ? detail.images.map((img) => "/uploads/" + img.image_path)
      : [];
    return [...mainImage, ...additionalImages];
  });

  // ฟังก์ชันส่งข้อมูลสร้าง Trip
  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // กำหนดค่า need_guide และ need_driver จาก travelOption
    const needs_guide = travelOption === "guide";
    const needs_driver = travelOption === "driver";

    try {
      const res = await axios.post(
        "/trips_uploads",
        {
          name: tripName,
          start_date: startDate || null,
          conditions,
          max_people: maxPeople,
          needs_guide,
          needs_driver,
          tourist_attraction_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${window.userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      navigate(`/trip/${res.data.id}`);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };
return (
  
  <div className="flex flex-col h-screen w-screen bg-white text-slate-900 px-4 md:px-12 mt-12"> 
  {/* Header */} 
  <div className="w-full h-[300px] bg-white flex flex-col justify-center px-6 md:px-12 py-5 relative overflow-hidden"> 
    {/* Decorative blobs */} 
    <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-indigo-100/30 blur-2xl"></div> 
    <div className="pointer-events-none absolute -bottom-12 -left-10 w-32 h-32 rounded-full bg-emerald-100/30 blur-2xl"></div> 
    {/* Top row */} 
    <div className="flex items-center justify-between mb-4"> 
      <div className="inline-flex items-center gap-4 text-blue-800 bg-blue-200 px-5 py-3 rounded-full text-lg font-bold"> 
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"> 
        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" /> 
        </svg> รายละเอียดสถานที่
        </div>  {/* ปุ่มกลับ */}
      <button
        onClick={() => navigate(-1)}
        className="self-start px-6 py-3 bg-blue-600 text-white rounded-3xl font-semibold shadow hover:bg-blue-700 transition transform hover:scale-105 text-xl md:text-2xl mb-4"
      >
        กลับ
      </button>
        </div>
      <h1 className="text-6xl font-extrabold text-slate-900 mb-4 mt-5">
        รายละเอียดสถานที่
      </h1>
      <p className="text-2xl text-slate-700 mb-6"> รายละเอียดเพิ่มเติมขิงสถานที่ </p>
    </div>

    {/* Content */}
    <div className="flex-1 overflow-auto flex flex-col items-center gap-6 w-full max-w-4xl mx-auto py-4">
     

      {/* Card ของแต่ละสถานที่ + รูปภาพ */}
      {details.map((detail) => (
        <div
          key={detail.id}
          className="w-full bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-6 md:p-8 shadow-md flex flex-col space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">{detail.description}</h2>
          <div className="flex flex-col gap-2 text-xl md:text-2xl text-slate-700">
            <p><strong>เปิด:</strong> {detail.open_time || "-"}</p>
            <p><strong>ปิด:</strong> {detail.close_time || "-"}</p>
            <p><strong>ค่าเข้า:</strong> {detail.entry_fee ? `${detail.entry_fee} บาท` : "-"}</p>
            <p><strong>หมวดหมู่:</strong> {detail.tag || "-"}</p>
            <p><strong>ติดต่อ:</strong> {detail.contact_info || "-"}</p>
          </div>

          {allImages.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {allImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Attraction Image ${i + 1}`}
                  className="w-[200px] h-[150px] md:w-[250px] md:h-[180px] object-cover rounded-2xl shadow"
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* ฟอร์มสร้าง Trip */}
      <div className="w-full bg-gradient-to-r from-green-50 to-green-100 rounded-3xl p-6 md:p-8 shadow-md flex flex-col space-y-4 mt-6">
        <h3 className="text-2xl md:text-3xl font-semibold text-center mb-2">สร้าง Trip ใหม่โดยใช้สถานที่นี้</h3>
        <form onSubmit={handleCreateTrip} className="flex flex-col gap-4 text-xl md:text-2xl">
          <label className="flex flex-col">
            ชื่อทริป:
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              required
              className="mt-1 p-2 rounded-xl border border-gray-300"
            />
          </label>

          <label className="flex flex-col">
            วันที่เริ่มต้น:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 p-2 rounded-xl border border-gray-300"
            />
          </label>

          <label className="flex flex-col">
            เงื่อนไข:
            <textarea
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              className="mt-1 p-2 rounded-xl border border-gray-300 w-full h-24"
            />
          </label>

          <label className="flex flex-col">
            จำนวนคนที่ต้องการ:
            <input
              type="number"
              min="1"
              value={maxPeople}
              onChange={(e) => setMaxPeople(Number(e.target.value))}
              className="mt-1 p-2 rounded-xl border border-gray-300"
            />
          </label>

          {/* Radio button สำหรับเลือก travel option */}
          <div className="flex flex-col gap-2">
            <p>เลือกประเภทการเดินทาง:</p>
            <label>
              <input
                type="radio"
                name="travelOption"
                value="guide"
                checked={travelOption === "guide"}
                onChange={(e) => setTravelOption(e.target.value)}
              /> อยากได้ไกด์ที่พาเที่ยวด้วย
            </label>
            <label>
              <input
                type="radio"
                name="travelOption"
                value="driver"
                checked={travelOption === "driver"}
                onChange={(e) => setTravelOption(e.target.value)}
              /> ต้องการแค่คนไปส่ง
            </label>
            <label>
              <input
                type="radio"
                name="travelOption"
                value="none"
                checked={travelOption === "none"}
                onChange={(e) => setTravelOption(e.target.value)}
              /> ไม่ต้องการเลย
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-3xl font-semibold shadow hover:bg-green-700 transition transform hover:scale-105"
          >
            {loading ? "กำลังสร้าง..." : "สร้าง Trip"}
          </button>
        </form>
        {error && <p className="text-red-600 text-center">{error}</p>}
      </div>
    </div>
  </div>
);
    
   
}
