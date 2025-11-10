import React, { useState, useRef } from 'react';
import communication_logo from '../assets/communication.svg';
import education_logo from '../assets/education.svg';
import work_logo from '../assets/work.svg';

const YearlyLifetimeMembershipForm = () => {
  // Current date for age calculation - dynamic
  const today = new Date();

  // Ref for photo input to clear file on remove
  const photoRef = useRef(null);

  // State for personal details
  const [personalDetails, setPersonalDetails] = useState({
    registrationType: 'Yearly',
    fullName: '',
    gender: 'Male',
    dateOfBirth: '',
    age: '',
    nativePlace: '',
    taluka: '',
    district: '',
    mobileNumber: '',
    email: '',
    maritalStatus: '',
    photo: null,
    photoPreview: null,
  });

  // Errors for personal
  const [personalErrors, setPersonalErrors] = useState({});

  // State for occupation details
  const [occupationDetails, setOccupationDetails] = useState({
    occupation: '',
    companyName: '',
    occupationAddress: '',
    bloodGroup: '',
    donateBlood: 'No',
  });

  // State for education details
  const [educationDetails, setEducationDetails] = useState({
    educationCategory: '',
    educationMedium: '',
  });

  // State for communication details
  const [communicationDetails, setCommunicationDetails] = useState({
    residentialAddress: '',
    city: '',
    pinCode: '',
  });

  // Errors for communication
  const [commErrors, setCommErrors] = useState({});

  // State for family members (start with one)
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: '', relation: '', dob: '', maritalStatus: '', qualification: '', business: '', bloodGroup: '' },
  ]);

  // Errors for family
  const [familyErrors, setFamilyErrors] = useState([{ name: '', relation: '', business: '' }]);

  // Function to calculate age
  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age.toString() : '';
  };

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handlers for personal details
  const handlePersonalChange = (e) => {
    const { name, value, type, files } = e.target;
    let newValue = value;

    if (type === 'file') {
      const file = files[0];
      setPersonalDetails({ 
        ...personalDetails, 
        photo: file,
        photoPreview: file ? URL.createObjectURL(file) : null 
      });
      return;
    }

    // Input filtering and validation
    if (['fullName', 'taluka', 'district'].includes(name)) {
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
      setPersonalErrors({ ...personalErrors, [name]: '' });
    } else if (name === 'age') {
      const num = parseInt(value, 10);
      newValue = (isNaN(num) || num < 0 || num > 150) ? '' : num.toString();
      setPersonalErrors({ ...personalErrors, [name]: newValue ? '' : 'Age must be between 0 and 150' });
    } else if (name === 'mobileNumber') {
      newValue = value.replace(/\D/g, '').slice(0, 10);
      setPersonalErrors({ ...personalErrors, [name]: newValue.length === 10 ? '' : 'Mobile must be exactly 10 digits' });
    } else if (name === 'dateOfBirth') {
      const age = calculateAge(value);
      setPersonalDetails(prev => ({ ...prev, age }));
      setPersonalErrors({ ...personalErrors, [name]: '' });
    } else if (name === 'email') {
      newValue = value;
      if (type === 'blur') {
        const emailError = validateEmail(newValue) ? '' : 'Invalid email format';
        setPersonalErrors({ ...personalErrors, [name]: emailError });
      }
    }

    const updated = { ...personalDetails, [name]: newValue };
    setPersonalDetails(updated);
  };

  // Remove photo - clears state and input value
  const removePhoto = () => {
    setPersonalDetails({ ...personalDetails, photo: null, photoPreview: null });
    if (photoRef.current) {
      photoRef.current.value = '';
    }
  };

  // Handlers for communication details
  const handleCommunicationChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'pinCode') {
      newValue = value.replace(/\D/g, '').slice(0, 6);
      setCommErrors({ ...commErrors, [name]: newValue.length === 6 ? '' : 'Pin code must be exactly 6 digits' });
    }

    setCommunicationDetails({ ...communicationDetails, [name]: newValue });
  };

  // Handler for family members
  const handleFamilyChange = (id, field, value) => {
    let newValue = value;

    // Find index
    const index = familyMembers.findIndex(m => m.id === id);
    const currentErrors = [...familyErrors];

    if (['name', 'relation', 'business'].includes(field)) {
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
      currentErrors[index] = { ...currentErrors[index], [field]: '' };
    }

    const currentFamily = [...familyMembers];
    currentFamily[index] = { ...currentFamily[index], [field]: newValue };
    setFamilyMembers(currentFamily);
    setFamilyErrors(currentErrors);
  };

  // Add family member
  const addFamilyMember = () => {
    if (familyMembers.length < 6) {
      const newId = familyMembers.length + 1;
      const newMember = {
        id: newId,
        name: '',
        relation: '',
        dob: '',
        maritalStatus: '',
        qualification: '',
        business: '',
        bloodGroup: '',
      };
      const newErrors = {
        name: '',
        relation: '',
        business: '',
      };
      setFamilyMembers([...familyMembers, newMember]);
      setFamilyErrors([...familyErrors, newErrors]);
    }
  };

  // Remove family member and renumber
  const removeFamilyMember = (idToRemove) => {
    if (familyMembers.length > 1) {
      const index = familyMembers.findIndex(m => m.id === idToRemove);
      const newFamilyMembers = familyMembers.filter(m => m.id !== idToRemove);
      const newFamilyErrors = familyErrors.filter((_, i) => i !== index);

      // Renumber IDs sequentially
      const renumberedMembers = newFamilyMembers.map((member, idx) => ({
        ...member,
        id: idx + 1
      }));

      setFamilyMembers(renumberedMembers);
      setFamilyErrors(newFamilyErrors);
    }
  };

  // Handlers for occupation details
  const handleOccupationChange = (e) => {
    const { name, value } = e.target;
    setOccupationDetails({ ...occupationDetails, [name]: value });
  };

  // Handlers for education details
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducationDetails({ ...educationDetails, [name]: value });
  };

  // Options
  const genderOptions = ['Male', 'Female', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const donateBloodOptions = ['Yes', 'No'];
  const educationMediumOptions = ['English', 'Regional', 'Other'];
  const nativePlaceOptions = [
    'Anandpur', 'Anidra', 'Bajarada', 'Baldana', 'Bhadreshi', 'Bhaduka', 'Bharad', 'Bhojpura', 'Bodiya', 'Borana',
    'Chachka', 'Chatriyala', 'Choki', 'Chuda', 'Dhrangdhra', 'Ganjela', 'Ghanad', 'Gomta', 'Hematpar', 'Javaraj',
    'Jepar', 'Joravarnagar', 'Kanthariya', 'Karol', 'Katariya', 'Kharva', 'Khodu', 'Kholdiyad', 'Koth', 'Lilapur',
    'Liyad', 'Malod', 'Mojidad', 'Motivavdi', 'Nagnesh', 'Nana Kerala', 'Nani Morvad', 'Paccham', 'Pandri', 'Pedhda',
    'Pratappur', 'Rajsitapur', 'Rampara', 'Rangpur', 'Raska', 'Ratanpar', 'Salala', 'Sauka', 'Sayla', 'Sejakpar',
    'Siddhsar', 'Somasar', 'Sujangadh', 'Tikar', 'Vadod', 'Vaghela', 'Vakhatpar', 'Vejalka', 'Wadhwan', 'Zobala',
    'Pansina', 'Nava Sudamda'
  ];
  const occupationOptions = [
    'Business', 'Salaried', 'Professional', 'Retired', 'Not Employed', 'Passed Away',
    'Housewife', 'Farmer', 'Student', 'Bantling or Small Kid'
  ];
  const educationCategoryOptions = [
    'Pre-Primary (Playgroup to Sr. KG. )', 'Primary (Std. 1 to 8)', 'Secondary (Std. 9 and 10)',
    'Higher Secondary (Std. 11 and 12)', 'Diploma', 'Graduate', 'Post Graduate', 'Doctorate',
    'Certificate Course', 'Other'
  ];
  const qualificationOptions = educationCategoryOptions;

  // User SVG icon
  const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  // Briefcase icon
  const BriefcaseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="1.5">
      <path d="M9 11H3v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9h-6V7a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v4z"></path>
    </svg>
  );

  // Graduation cap
  const GraduationIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="1.5">
      <path d="M22 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4M12 12L2 22h20L12 12z"></path>
    </svg>
  );


  // Users icon for family
  const UsersIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  // Error message style
  const errorStyle = { color: '#d32f2f', fontSize: '11px', marginTop: '2px' };

  // Compact input style
  const inputStyle = { 
    width: '100%', 
    padding: '6px 8px', 
    marginTop: '3px', 
    border: '1px solid #e0e0e0', 
    borderRadius: '4px', 
    fontSize: '14px',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };

  // Compact section style - minimalist with subtle shadow
  const sectionStyle = { 
    border: '1px solid #e0e0e0', 
    padding: '12px', 
    borderRadius: '8px', 
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    borderLeft: '3px solid #d32f2f',
    overflow: 'hidden'
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: 'white'
    }}>
      {/* Form Title */}
      <h1 style={{ 
        color: '#d32f2f', 
        textAlign: 'center', 
        marginBottom: '25px', 
        fontSize: '24px', 
        fontWeight: '600',
        borderBottom: '1px solid #e0e0e0', 
        paddingBottom: '10px' 
      }}>
        YEARLY / LIFETIME MEMBERSHIP FORM
      </h1>

      {/* Main layout: Personal left, right column with Occupation, Education, Communication stacked equally */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'stretch' }}>
        {/* Left column: Personal */}
        <div style={{ flex: 1 }}>
          <div style={sectionStyle}>
            <h3 style={{ color: '#d32f2f', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', fontWeight: '500' }}>
              <UserIcon /> Personal Detail
            </h3>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '12px', flexWrap: 'wrap', fontSize: '14px' }}>
              <label style={{ fontWeight: '500', minWidth: '120px' }}>Registration Type<span style={{color: '#d32f2f'}}>*</span>:</label>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="registrationType"
                    value="Yearly"
                    checked={personalDetails.registrationType === 'Yearly'}
                    onChange={handlePersonalChange}
                    style={{ cursor: 'pointer' }}
                  />
                  Yearly
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="registrationType"
                    value="Lifetime"
                    checked={personalDetails.registrationType === 'Lifetime'}
                    onChange={handlePersonalChange}
                    style={{ cursor: 'pointer' }}
                  />
                  Lifetime
                </label>
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Full Name<span style={{color: '#d32f2f'}}>*</span></label>
              <input
                type="text"
                name="fullName"
                value={personalDetails.fullName}
                onChange={handlePersonalChange}
                placeholder="Full Name"
                style={inputStyle}
                required
              />
              {personalErrors.fullName && <div style={errorStyle}>{personalErrors.fullName}</div>}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Gender<span style={{color: '#d32f2f'}}>*</span></label>
              <select
                name="gender"
                value={personalDetails.gender}
                onChange={handlePersonalChange}
                style={inputStyle}
                required
              >
                {genderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Date of Birth<span style={{color: '#d32f2f'}}>*</span></label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={personalDetails.dateOfBirth}
                  onChange={handlePersonalChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>OR Age</label>
                <input
                  type="number"
                  name="age"
                  value={personalDetails.age}
                  onChange={handlePersonalChange}
                  style={inputStyle}
                />
                {personalErrors.age && <div style={errorStyle}>{personalErrors.age}</div>}
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Native Place<span style={{color: '#d32f2f'}}>*</span></label>
              <select
                name="nativePlace"
                value={personalDetails.nativePlace}
                onChange={handlePersonalChange}
                style={inputStyle}
                required
              >
                <option value="">Select Native</option>
                {nativePlaceOptions.map(place => <option key={place} value={place}>{place}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Taluka<span style={{color: '#d32f2f'}}>*</span></label>
              <input
                type="text"
                name="taluka"
                value={personalDetails.taluka}
                onChange={handlePersonalChange}
                placeholder="Taluka"
                style={inputStyle}
                required
              />
              {personalErrors.taluka && <div style={errorStyle}>{personalErrors.taluka}</div>}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>District<span style={{color: '#d32f2f'}}>*</span></label>
              <input
                type="text"
                name="district"
                value={personalDetails.district}
                onChange={handlePersonalChange}
                placeholder="District"
                style={inputStyle}
                required
              />
              {personalErrors.district && <div style={errorStyle}>{personalErrors.district}</div>}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Mobile Number<span style={{color: '#d32f2f'}}>*</span></label>
              <input
                type="tel"
                name="mobileNumber"
                value={personalDetails.mobileNumber}
                onChange={handlePersonalChange}
                placeholder="Mobile Number"
                style={inputStyle}
                required
              />
              {personalErrors.mobileNumber && <div style={errorStyle}>{personalErrors.mobileNumber}</div>}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Email</label>
              <input
                type="email"
                name="email"
                value={personalDetails.email}
                onChange={handlePersonalChange}
                onBlur={handlePersonalChange}
                placeholder="Your Email"
                style={inputStyle}
              />
              <small style={{ color: '#d32f2f', display: 'block', marginBottom: '3px', fontSize: '11px' }}>Note: Please don't use rediffmail email address</small>
              {personalErrors.email && <div style={errorStyle}>{personalErrors.email}</div>}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Marital Status<span style={{color: '#d32f2f'}}>*</span></label>
              <select
                name="maritalStatus"
                value={personalDetails.maritalStatus}
                onChange={handlePersonalChange}
                style={inputStyle}
                required
              >
                <option value="">Select</option>
                {maritalStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '0' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Upload Photo<span style={{color: '#d32f2f'}}>*</span></label>
              <input
                type="file"
                name="photo"
                ref={photoRef}
                onChange={handlePersonalChange}
                accept="image/*"
                style={{ ...inputStyle, padding: '4px' }}
                required
              />
              {personalDetails.photoPreview && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img 
                    src={personalDetails.photoPreview} 
                    alt="Preview" 
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e0e0e0' }} 
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    style={{
                      backgroundColor: '#f8f9fa',
                      color: '#d32f2f',
                      padding: '4px 8px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Occupation, then Education, then Communication stacked equally */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', height: '100%' }}>
          {/* Occupation */}
          <div style={sectionStyle}>
            <h3 style={{ color: '#d32f2f', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', fontWeight: '500' }}>
              <img src={work_logo} height={'30px'}></img> Occupation Detail
            </h3>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Occupation</label>
              <select
                name="occupation"
                value={occupationDetails.occupation}
                onChange={handleOccupationChange}
                style={inputStyle}
              >
                <option value="">Select</option>
                {occupationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={occupationDetails.companyName}
                onChange={handleOccupationChange}
                placeholder="Company Name"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Occupation Address</label>
              <input
                type="text"
                name="occupationAddress"
                value={occupationDetails.occupationAddress}
                onChange={handleOccupationChange}
                placeholder="Occupation Address"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Blood Group</label>
              <select
                name="bloodGroup"
                value={occupationDetails.bloodGroup}
                onChange={handleOccupationChange}
                style={inputStyle}
              >
                <option value="">Select</option>
                {bloodGroupOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '0' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Want to Donate Blood?</label>
              <select
                name="donateBlood"
                value={occupationDetails.donateBlood}
                onChange={handleOccupationChange}
                style={inputStyle}
              >
                {donateBloodOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {/* Education - after Occupation */}
          <div style={sectionStyle}>
            <h3 style={{ color: '#d32f2f', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', fontWeight: '500' }}>
              <img src={education_logo} height={'30px'}></img> Education Detail
            </h3>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Education Category</label>
              <select
                name="educationCategory"
                value={educationDetails.educationCategory}
                onChange={handleEducationChange}
                style={inputStyle}
              >
                <option value="">Select</option>
                {educationCategoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '0' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Education Medium</label>
              <select
                name="educationMedium"
                value={educationDetails.educationMedium}
                onChange={handleEducationChange}
                style={inputStyle}
              >
                <option value="">Select</option>
                {educationMediumOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {/* Communication - on right side */}
          <div style={sectionStyle}>
            <h3 style={{ color: '#d32f2f', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', fontWeight: '500' }}>
              <img src={communication_logo} height={'30px'}></img> Communication Detail
            </h3>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Residential Address<span style={{color: '#d32f2f'}}>*</span></label>
              <input
                type="text"
                name="residentialAddress"
                value={communicationDetails.residentialAddress}
                onChange={handleCommunicationChange}
                placeholder="Residential Address"
                style={inputStyle}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '0' }}>
              <div style={{ flex: 2 }}>
                <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>City<span style={{color: '#d32f2f'}}>*</span></label>
                <input
                  type="text"
                  name="city"
                  value={communicationDetails.city}
                  onChange={handleCommunicationChange}
                  placeholder="Enter Your City Name"
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '2px' }}>Pin Code</label>
                <input
                  type="text"
                  name="pinCode"
                  value={communicationDetails.pinCode}
                  onChange={handleCommunicationChange}
                  placeholder="Pin Code"
                  style={inputStyle}
                />
                {commErrors.pinCode && <div style={errorStyle}>{commErrors.pinCode}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Family Detail Table - Moved to bottom */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#d32f2f', borderBottom: '1px solid #e0e0e0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', fontWeight: '500' }}>
          <UsersIcon /> Family Detail
        </h3>
        <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e0e0e0', fontSize: '12px', fontWeight: '500', textAlign: 'left' }}>#</th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e0e0e0', fontSize: '12px', fontWeight: '500', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e0e0e0', fontSize: '12px', fontWeight: '500', textAlign: 'left' }}>Relation</th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e0e0e0', fontSize: '12px', fontWeight: '500', textAlign: 'left' }}>Date of Birth</th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e0e0e0', fontSize: '12px', fontWeight: '500', textAlign: 'left' }}>Marital Status</th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e0e0e0', fontSize: '12px', fontWeight: '500', textAlign: 'left' }}>Qualification</th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e0e0e0', fontSize: '12px', fontWeight: '500', textAlign: 'left' }}>Business</th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e0e0e0', fontSize: '12px', fontWeight: '500', textAlign: 'left' }}>Blood Group</th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid #e0e0e0', fontSize: '12px', fontWeight: '500', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {familyMembers.map((member, index) => (
                <tr key={member.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 8px', fontWeight: '500' }}>{index + 1}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleFamilyChange(member.id, 'name', e.target.value)}
                      placeholder="Name"
                      style={{ ...inputStyle, padding: '4px 6px', fontSize: '13px', border: '1px solid #e0e0e0' }}
                    />
                    {familyErrors[index]?.name && <div style={errorStyle}>{familyErrors[index].name}</div>}
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <input
                      type="text"
                      value={member.relation}
                      onChange={(e) => handleFamilyChange(member.id, 'relation', e.target.value)}
                      placeholder="Relation"
                      style={{ ...inputStyle, padding: '4px 6px', fontSize: '13px', border: '1px solid #e0e0e0' }}
                    />
                    {familyErrors[index]?.relation && <div style={errorStyle}>{familyErrors[index].relation}</div>}
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <input
                      type="date"
                      value={member.dob}
                      onChange={(e) => handleFamilyChange(member.id, 'dob', e.target.value)}
                      style={{ ...inputStyle, padding: '4px 6px', fontSize: '13px', border: '1px solid #e0e0e0' }}
                    />
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <select
                      value={member.maritalStatus}
                      onChange={(e) => handleFamilyChange(member.id, 'maritalStatus', e.target.value)}
                      style={{ ...inputStyle, padding: '4px 6px', fontSize: '13px', border: '1px solid #e0e0e0' }}
                    >
                      <option value="">Select</option>
                      {maritalStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <select
                      value={member.qualification}
                      onChange={(e) => handleFamilyChange(member.id, 'qualification', e.target.value)}
                      style={{ ...inputStyle, padding: '4px 6px', fontSize: '13px', border: '1px solid #e0e0e0' }}
                    >
                      <option value="">Select</option>
                      {qualificationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <input
                      type="text"
                      value={member.business}
                      onChange={(e) => handleFamilyChange(member.id, 'business', e.target.value)}
                      placeholder="Business"
                      style={{ ...inputStyle, padding: '4px 6px', fontSize: '13px', border: '1px solid #e0e0e0' }}
                    />
                    {familyErrors[index]?.business && <div style={errorStyle}>{familyErrors[index].business}</div>}
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <select
                      value={member.bloodGroup}
                      onChange={(e) => handleFamilyChange(member.id, 'bloodGroup', e.target.value)}
                      style={{ ...inputStyle, padding: '4px 6px', fontSize: '13px', border: '1px solid #e0e0e0' }}
                    >
                      <option value="">Select</option>
                      {bloodGroupOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                    {familyMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFamilyMember(member.id)}
                        style={{
                          backgroundColor: '#f8f9fa',
                          color: '#d32f2f',
                          padding: '4px 8px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {familyMembers.length < 6 && (
          <button
            type="button"
            onClick={addFamilyMember}
            style={{
              backgroundColor: 'transparent',
              color: '#d32f2f',
              padding: '8px 16px',
              border: '1px solid #d32f2f',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            + Add Family Member
          </button>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={() => {
          console.log({ personalDetails, occupationDetails, educationDetails, communicationDetails, familyMembers });
        }}
        style={{
          backgroundColor: '#d32f2f',
          color: 'white',
          padding: '12px 30px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'block',
          margin: '0 auto',
          fontSize: '15px',
          fontWeight: '500',
          boxShadow: '0 2px 4px rgba(211, 47, 47, 0.2)',
          transition: 'box-shadow 0.2s'
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default YearlyLifetimeMembershipForm;