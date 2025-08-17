import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function TouristDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  // รับ details จากหน้าเดิม (ถ้ามี), ถ้าไม่มีก็ค่อย fetch
  const passedDetails = location.state?.details || null;
  const [details, setDetails] = useState(Array.isArray(passedDetails) ? passedDetails : []);
  const { id } = useParams();

  // ฟอร์มสร้าง trip
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [conditions, setConditions] = useState("");
  const [maxPeople, setMaxPeople] = useState(1);
  const [travelOption, setTravelOption] = useState("none"); // guide | driver | none
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const [startTime, setStartTime] = useState("");

  // เลือกโพสต์
  const [selectedDetailId, setSelectedDetailId] = useState(null);

  // ค้นหา + หน้าเพจ
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20; // จำนวนรายการต่อหน้า (ปรับได้ตามต้องการ)

  // โหลดข้อมูลถ้าไม่ได้ส่งมาจากหน้าเดิม
  useEffect(() => {
    let cancelled = false;

    async function fetchDetail() {
      try {
        if (!passedDetails) {
          const response = await axios.get(`/api/tourist-attractions/${id}`);
          // รองรับทั้ง object และ array
          const fetched = Array.isArray(response.data) ? response.data : [response.data];
          if (!cancelled) {
            setDetails(fetched);
            setSelectedDetailId((prev) => prev ?? fetched[0]?.id ?? null);
          }
        } else if (passedDetails.length > 0) {
          setSelectedDetailId(passedDetails[0]?.id ?? null);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    }

    fetchDetail();
    return () => { cancelled = true; };
  }, [id, passedDetails]);

  // ถ้าไม่มีข้อมูลเลย
  if (!details || details.length === 0) {
    return (
      <div className="flex flex-col h-screen w-screen bg-white text-slate-900 px-4 md:px-12 mt-12">
        <div className="w-full h-[300px] flex items-center justify-between">
          <h1 className="text-3xl font-bold">กำลังโหลดข้อมูล...</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[#fecb00] text-white rounded-3xl font-semibold shadow hover:bg-blue-700 transition"
          >
            กลับ
          </button>
        </div>
      </div>
    );
  }

  // ฟังก์ชัน normalize string เพื่อค้นหาแบบ case-insensitive และกัน null
  const norm = (v) => (typeof v === "string" ? v.toLowerCase() : "");

  // กรองรายการตามคำค้นหา
  const filteredDetails = useMemo(() => {
    const q = norm(search);
    if (!q) return details;

    return details.filter((d) => {
      const fields = [
        d?.description,
        d?.tag,
        d?.contact_info,
        d?.open_time,
        d?.close_time,
      ]
        .map(norm)
        .join(" ");
      return fields.includes(q);
    });
  }, [details, search]);

  // ถ้า selectedDetail ไม่อยู่ในผลลัพธ์ที่กรอง ให้ย้าย selection ไปยังตัวแรกของ filtered
  useEffect(() => {
    if (filteredDetails.length === 0) return;
    const found = filteredDetails.some((d) => d?.id === selectedDetailId);
    if (!found) {
      setSelectedDetailId(filteredDetails[0]?.id ?? null);
      setPage(1);
    }
  }, [filteredDetails, selectedDetailId]);

  // Pagination จาก filtered list
  const totalPages = Math.max(1, Math.ceil(filteredDetails.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedDetails = filteredDetails.slice(startIdx, endIdx);

  // รายการที่ถูกเลือก (กัน null ทุก field)
  const selectedDetail =
    filteredDetails.find((d) => d?.id === selectedDetailId) ||
    filteredDetails[0] || {
      id: "__empty__",
      description: "",
      open_time: "",
      close_time: "",
      entry_fee: "",
      tag: "",
      contact_info: "",
      image: null,
      images: [],
    };

  // รวมภาพของโพสต์ที่เลือก
  const allImages = [
    ...(selectedDetail?.image
      ? [selectedDetail.image.startsWith("http") ? selectedDetail.image : "/uploads/" + selectedDetail.image]
      : []),
    ...(Array.isArray(selectedDetail?.images)
      ? selectedDetail.images.map((img) => "/uploads/" + img.image_path)
      : []),
  ];

  // ฟังก์ชันสร้าง Trip
  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const needs_guide = travelOption === "guide";
    const needs_driver = travelOption === "driver";

    try {
      const res = await axios.post(
        "/trips_uploads",
        {
          name: tripName,
          start_date: startDate || null,
        start_time: startTime || null,
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

  // UI
  return (
    <div className="flex flex-col h-screen w-screen bg-white text-slate-900 px-4 md:px-12 mt-12">
      {/* Header */}
      <div className="w-full bg-white flex flex-col justify-center px-6 md:px-12 py-5 relative overflow-hidden">
        {/* Decor */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-indigo-100/30 blur-2xl"></div>
        <div className="pointer-events-none absolute -bottom-12 -left-10 w-32 h-32 rounded-full bg-emerald-100/30 blur-2xl"></div>

        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-4 text-[#7f4534ff] bg-[#fecb00] px-5 py-3 rounded-full text-3xl font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
            </svg>
            รายละเอียดสถานที่
          </div>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-3xl font-semibold shadow hover:bg-blue-700 transition transform hover:scale-105 text-xl md:text-2xl"
          >
            กลับ
          </button>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-2">รายละเอียดสถานที่</h1>
        <p className="text-lg md:text-2xl text-slate-700">ค้นหา/เลือกโพสต์ด้านบนเพื่อดูรายละเอียด</p>
      </div>



        {/* การ์ดรายละเอียดโพสต์ที่เลือก */}
        <div className="w-full bg-gradient-to-r from-blue-50 to-blue-75 rounded-3xl p-6 md:p-8 shadow-md flex flex-col space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">
            {selectedDetail?.description || "-"}
          </h2>
          <div className="flex flex-col gap-2 text-base md:text-xl text-slate-700">
            <p><strong>เปิด:</strong> {selectedDetail?.open_time || "-"}</p>
            <p><strong>ปิด:</strong> {selectedDetail?.close_time || "-"}</p>
            <p><strong>ค่าเข้า:</strong> {selectedDetail?.entry_fee ? `${selectedDetail.entry_fee} บาท` : "-"}</p>
            <p><strong>หมวดหมู่:</strong> {selectedDetail?.tag || "-"}</p>
            <p><strong>ติดต่อ:</strong> {selectedDetail?.contact_info || "-"}</p>
          </div>

          {/* แกลเลอรีรูปภาพของโพสต์ที่เลือก */}
          {allImages.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {allImages.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={`Attraction Image ${i + 1}`}
                  className="w-[200px] h-[150px] md:w-[250px] md:h-[180px] object-cover rounded-2xl shadow"
                />
              ))}
            </div>
          )}
        </div>

      {/* Content */}
<div className=" mt-6 mb-6">

  {/* Search + Stats + Pagination */}
  <div className="w-full bg-white/80 rounded-2xl border border-slate-200 p-6 shadow-md">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

      {/* Search */}
      <div className="col-span-1">
        <label className="block text-base font-semibold text-slate-700 mb-2">ค้นหาโพสต์</label>
        <input
          type="text"
          placeholder="พิมพ์คำค้น เช่น ชื่อ, แท็ก, เวลาเปิดปิด, ติดต่อ"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
        />
      </div>

      {/* Stats */}
      <div className="col-span-1 flex flex-col md:items-center gap-1 text-sm md:text-base">
        <span className="text-slate-500">ทั้งหมด: {details.length.toLocaleString()} โพสต์</span>
        <span className="text-slate-700 font-semibold">
          พบ: {filteredDetails.length.toLocaleString()} โพสต์
        </span>
        <span className="text-slate-500">
          หน้าที่ {currentPage} / {totalPages}
        </span>
      </div>

      {/* Pagination Controls */}
      <div className="col-span-1 flex flex-wrap gap-2 justify-end">
        {[["« หน้าแรก", 1], ["‹ ก่อนหน้า", Math.max(1, currentPage - 1)], ["ถัดไป ›", Math.min(totalPages, currentPage + 1)], ["หน้าสุดท้าย »", totalPages]].map(([label, pageNum], idx) => (
          <button
            key={idx}
            onClick={() => setPage(pageNum)}
            disabled={(label.includes("หน้าแรก") || label.includes("ก่อนหน้า")) ? currentPage === 1 : currentPage === totalPages}
            className="px-4 py-2 rounded-2xl border bg-gray-200 text-gray-700 disabled:opacity-40 hover:bg-yellow-400 hover:text-white transition-colors text-base"
          >
            {label}
          </button>
        ))}
      </div>
    </div>

    {/* รายการปุ่มเลือกโพสต์ */}
    <div className="mt-6 flex flex-wrap gap-3">
      {paginatedDetails.length === 0 ? (
        <div className="text-slate-500 text-lg">ไม่พบผลลัพธ์ตามคำค้น</div>
      ) : (
        paginatedDetails.map((detail) => {
          const isActive = selectedDetailId === detail?.id;
          const label = detail?.description
            ? (detail.description.length > 30 ? detail.description.slice(0, 30) + "..." : detail.description)
            : "ไม่มีคำอธิบาย";
          return (
            <button
              key={detail?.id ?? Math.random()}
              onClick={() => setSelectedDetailId(detail?.id)}
              className={`px-5 py-3 rounded-2xl border text-base font-semibold transition ${
                isActive
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-gray-200 text-gray-800 border-gray-300 hover:bg-yellow-400 hover:text-white"
              }`}
              title={detail?.description || ""}
            >
              {label}
            </button>
          );
        })
      )}
    </div>
  </div>
</div>


        {/* ฟอร์มสร้าง Trip */}
        <div className="w-full bg-gradient-to-r from-blue-50 to-blue-75 rounded-3xl p-6 md:p-8 shadow-md flex flex-col space-y-4">
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-2">สร้าง Trip ใหม่โดยใช้สถานที่นี้</h3>
          <form onSubmit={handleCreateTrip} className="flex flex-col gap-4 text-base md:text-xl">
            <label className="flex flex-col">
              ชื่อทริป:
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                required
                className="mt-1 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>

            <label className="flex flex-col">
              วันที่เริ่มต้น:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>

            <label className="flex flex-col">
              เวลาเริ่มต้น:
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>

            <label className="flex flex-col">
              เงื่อนไข:
              <textarea
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                className="mt-1 p-2 rounded-xl border border-gray-300 w-full h-24 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>

            <label className="flex flex-col">
              จำนวนคนที่ต้องการ:
              <input
                type="number"
                min="1"
                value={maxPeople}
                onChange={(e) => setMaxPeople(Number(e.target.value))}
                className="mt-1 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>

            {/* เลือกประเภทการเดินทาง */}
            <div className="flex flex-col gap-2">
              <p className="font-medium">เลือกประเภทการเดินทาง:</p>
              <label className="inline-flex gap-2 items-center">
                <input
                  type="radio"
                  name="travelOption"
                  value="guide"
                  checked={travelOption === "guide"}
                  onChange={(e) => setTravelOption(e.target.value)}
                />
                <span>อยากได้ไกด์ที่พาเที่ยวด้วย</span>
              </label>
              <label className="inline-flex gap-2 items-center">
                <input
                  type="radio"
                  name="travelOption"
                  value="driver"
                  checked={travelOption === "driver"}
                  onChange={(e) => setTravelOption(e.target.value)}
                />
                <span>ต้องการแค่คนไปส่ง</span>
              </label>
              <label className="inline-flex gap-2 items-center">
                <input
                  type="radio"
                  name="travelOption"
                  value="none"
                  checked={travelOption === "none"}
                  onChange={(e) => setTravelOption(e.target.value)}
                />
                <span>ไม่ต้องการเลย</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
        className="w-full px-8 py-5 bg-[#fecb00] text-[#7f4534ff] rounded-3xl font-semibold shadow hover:bg-blue-700 transition transform hover:scale-105 text-4xl"
            >
              {loading ? "กำลังสร้าง..." : "สร้าง Trip"}
            </button>
          </form>

          {error && <p className="text-red-600 text-center">{error}</p>}
        </div>
      </div>

  );
}
