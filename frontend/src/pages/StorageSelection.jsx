import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StorageSelection() {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('');
    const [showError, setShowError] = useState(false);
    
    const handleSelect = () => {
      if (!selectedOption) {
        setShowError(true);
        return;
      }
      setShowError(false);
      
      // Navigate based on selection
      if (selectedOption === 'local') {
        navigate('/upload');
      } else if (selectedOption === 'cloud') {
        navigate('/cloud-setup');
      }
    };
  
    return (
      <div className="page-container">
        <h1 className="text-center mb-6">Access your proprietary data</h1>
        <h1 className="text-center mb-6">Your proprietary data stays your proprietary data - details below</h1>
        <div className="section">
          <div className="option-container">
            <input
              type="radio"
              id="option1"
              name="dataAccess"
              value="local"
              checked={selectedOption === 'local'}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                setShowError(false);
              }}
              className="option-radio"
            />
            <label htmlFor="option1" className="option-label">
              Option1:  Access your data through your typical means of storage
            </label>
          </div>

          <ol className="instruction-list">
            <li>
              On the next page, "Select" will open your "File Explorer" in Windows or "Finder" in Mac OS
            </li>
            <li>
              Select the data from any and all sources accessible through this selection box. 
              "Ctrl + A" or "Cmd + A" will select all data in a particular folder, or you can 
              select individual files.  You can select data from multiple sources.  When finished, click "Submit" 
            </li>
            <li>
              Any type of storage device accessible to your work station can be mapped including 
              cloud servers, local servers, thumb drives inserted into your workstation and the like.
            </li>
            <li>
              Select all files that may be relevant to your analysis. These file types of files virtually any text, (e.g. .LAS), seismic, .csv, spreadsheet, 
              google sheets, PDF's, hand written notes and more. Our system will evaluate them for qualityand 
              parse them into the proper locations.
            </li>
            <li>
              Although meta data from the AI analysis in the platform may be retained for audit 
              purposes or for your use when you return, this WILL NOT include any of your actual data, which will be deleted from our system after your session analysis, unless you choose otherwise.  
            </li>
            <li>
              When completed selecting all data, click "Submit" and this will save the mapping to 
              the platform.
            </li>
          </ol>
        </div>

        <div className="section">
          <div className="option-container">
            <input
              type="radio"
              id="option2"
              name="dataAccess"
              value="cloud"
              checked={selectedOption === 'cloud'}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                setShowError(false);
              }}
              className="option-radio"
            />
            <label htmlFor="option2" className="option-label">
              Option 2: Use Earthscan provided secure cloud storage
            </label>
          </div>
          <ol className="instruction-list">
            <li>
              The second way to make your data accessible is for Earthscan to provide you with 
              a secure cloud based silo that only you will have access to. We set it up and send 
            you a temporary password which must be immediately changed. From there, only you have 
            access to your data in the secure encrypted silo provided by our cloud provider.
          </li>
          <li>
            Once you have your secure cloud silo set up, you can select your data directly as in Option1. 
            by selecting files from your computer, server or cloud storage. The data will be 
            encrypted during transfer and at rest.
          </li>
          <li>
            After uploading your data, you can proceed with the analysis. As with Option 1, any 
            meta data from the AI analysis may be retained, but your actual data will be deleted 
            after your session unless you choose otherwise.
          </li>
          <li>
            If you select this option, click "Continue" and you will be directed to set up your 
            secure cloud silo credentials.
          </li>
        </ol>
        </div>
        {showError && (
          <div className="terms-error-message">
            Please select a data access option to proceed.
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={handleSelect}
            className="button"
          >
            Continue
          </button>
        </div>
      </div>
    );
}