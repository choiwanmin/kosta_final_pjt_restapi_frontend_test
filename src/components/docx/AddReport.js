// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import axios from 'axios';

// const App = () => {
//     const loginId = sessionStorage.getItem('loginId');
//     const [activeTab, setActiveTab] = useState('report');
//     const [formData, setFormData] = useState({
//         title:'',
//         writer:loginId,
//         enddt:'',
//         taskplan:'',
//         taskprocs:'',
//         senior:[],
//         status:'',
//         formtype:'보고서',
//     });

//     //탭메뉴 클릭시 해당 탭 이름으로 탭 활성화
//     const handleTabClick = (tabName) => {
//         setActiveTab(tabName);
//     };


//     const handleInputChange = (e) => {
//         const {name, value} = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const addSelectedMembers = (event) => {
//         event.preventDefault();

//     }
// }