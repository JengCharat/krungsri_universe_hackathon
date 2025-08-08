import React from "react";

export default function Navbar({ title, LOGO }) {
const menuItems = [
{ label: "LOGIN", link: "#" },
{ label: "REGISTER", link: "#" },
];
return (
<div className="navbar flex justify-between p-6">
    <div className="logo">
        <h1 className="text-red-600">LOGO</h1>
        <h1 className="text-blue-700">title: {title}</h1>
        <h1 className="text-blue-700">LOGO: {LOGO}</h1>
    </div>
    <div className="item-list ">
        <ul className="flex">
            {menuItems.map((item, index) => (
            <li key={index} className="px-3">
                <a href={item.link}>{item.label}</a>
            </li>
            ))}
        </ul>
    </div>
</div>
);
}
