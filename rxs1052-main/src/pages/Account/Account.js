import React, { useState, useEffect, useRef } from "react";
import ProgWithHeaderLayout from "../../styles/ProgWithHeaderLayout";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import ReactModal from "react-modal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Swal from "sweetalert2";
import FileSaver from "file-saver";
import { saveAs } from "file-saver";

export default function Account() {
  
  ReactModal.setAppElement('#root')

    const client = axios.create({
        baseURL: 'http://127.0.0.1:8000'
    });

    const [weight, setWeight] = useState('')
    const [userWeight, setUserWeight] = useState([])
    const [pastUserWeight, setPastUserWeight] = useState(null)
    const token = sessionStorage.getItem('authenticateTokens');

    if(token) {
      const decodeToken = jwtDecode(token);
      var userID = decodeToken.user_id

    }

//Submit weight   
const headers = {
      'Content-Type': 'application/json',
}

  
function handleSubmit(e) {
  e.preventDefault();
  const body = JSON.stringify({
      user: userID,
      weight: weight,
  })

  client.post("/userapi/api/weight/", body, {headers : headers}) 
    .then(function (response) {
  if (response.status === 201) {
        window.location.reload()
  } })

  .catch (error => {
    Swal.fire({
      position: 'top-right',
      icon: 'error',
      title: 'Error while setting weight',
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1200,
      toast: true
    })
})

};

//update weight
function handleUpdate(e) {
  e.preventDefault();
  const body = JSON.stringify({
    user: userID,
    weight: weight,
})

const url2 = `/userapi/api/weight/${userID}`


client.put(url2, body, {headers : headers}) 
    .then(function (response) {
  if (response.status === 200) {
        setWeight('')
        Swal.fire({
          position: 'top-right',
          icon: 'success',
          title: 'Weight updated',
          showConfirmButton: false,
          timer: 1200,
        })
  } })

  .catch (error => {
    Swal.fire({
      position: 'top-right',
      icon: 'success',
      title: 'Set updated',
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1200,
      toast: true
    })
})


}

//get weight


const url = `/userapi/api/weight/show/${userID}`

useEffect (() => {

  const getUserWeight = () => {

  client.get(url, {headers : headers}).then((response) => {

      if (response.status === 200) {
        if (response.data !== null && response.data !== undefined) {
          setUserWeight(response.data);
        } else {
          console.log("Weight data is not available.");
        }
      }
    }).catch((error) => {
      console.error("Error fetching data: ", error);
    });


  }

  getUserWeight();
  const interval = setInterval(getUserWeight, 1500);
  return () => clearInterval(interval);
  
   

}, [url]);

function dateFormatter(x) {

  const splitDate = x.split('-');
  const day = splitDate[2];
  const month = splitDate[1];
  const year = splitDate[0];

  return `${day}-${month}-${year}`


}

//console.log(dateFormatter(userWeight.date))

const url3 = `/userapi/api/weight/past/${userID}`

useEffect(() => {

  const getPastWeight = () => {

  client.get(url3, {headers : headers}).then((response) => {

      if (response.status === 200) {
        if (response.data !== null && response.data !== undefined) {
          setPastUserWeight(response.data);
          console.log(response.data);
        } else {
          console.log("Past user weight data is not available.");
        }
      }
    }).catch((error) => {
      console.error("Error fetching:", error);
    });
  }

  getPastWeight();
  const interval2 = setInterval(getPastWeight, 1500);
  return () => clearInterval(interval2);
  
  

}, [url3])


const [userGoals, setUserGoals] = useState([])

const ShowGoalURL = `/userapi/api/goals/${userID}`

useEffect(() => {

  const getUserGoals = () => {

    client.get(ShowGoalURL, {headers : headers}).then((response) => {

    if (response.status === 200) {
      if (response.data !== null && response.data !== undefined) {
        setUserGoals(response.data);
        console.log(response.data);
      } else {
        console.log("User goals cannot be found");
      }
    }
  }).catch((error) => {
    console.error("Error fetching:", error);
  });

  }

  getUserGoals();
  const interval3 = setInterval(getUserGoals, 1500);
  return () => clearInterval(interval3);
  


}, [ShowGoalURL])

const [goals, setGoals] = useState('')


function handleGoalSet(e) {
  e.preventDefault();
  const body = JSON.stringify({
      user: userID,
      goals: goals,
  })

  client.post("/userapi/api/goals/", body, {headers : headers}) 
    .then(function (response) {
  if (response.status === 201) {
        setGoals('')
        Swal.fire({
          icon: 'success',
          title: 'Goal set successfully',
        })
  } })

  .catch ((error) => {
    Swal.fire({
      position: 'top-right',
      icon: 'success',
      title: 'Error while setting goal',
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1200,
      toast: true
    })
  })
};

const handleGoalRemove = (id) => {
  client.delete(`/userapi/api/goals/remove/${id}`, {headers : headers}) 
    .then(function (response) {
  if (response.status === 204) {
        Swal.fire({
          icon: 'success',
          title: 'Goal completed. Well done',
        })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Please try again',
    })
    }
  })
};

const weightChart = useRef(null)

const downloadChartAsImage = () => {
  let source = new XMLSerializer().serializeToString(weightChart.current.querySelector('svg'));
  const sBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(sBlob);

  const img = new Image();
  img.onload = () => {
    // Create a canvas element to draw the SVG image
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    // Convert canvas to PNG data URL
    const pngUrl = canvas.toDataURL("image/png");
    FileSaver.saveAs(pngUrl, 'chart.png')
  };
  img.src = url;
};

return (

<ProgWithHeaderLayout>
  <div className="container py-5">
    <div className="row mb-4 mx-auto">
      <div className="col text-center mt-4">
        <h2 style={{textDecoration: 'underline', fontSize: '40px'}}>Your weight:</h2>
        {userWeight.length === 0 ? (
          <button className="btn btn-primary mt-2 mb-4 px-5 py-2" data-bs-toggle="modal" data-bs-target="#setWeightModal">
              Set weight
          </button>
        ) : <p style={{fontSize: '35px'}} className="mb-2">{userWeight.weight}kg</p>}
        {userWeight.length !== 0 && <p style={{fontSize: '20px'}}>{dateFormatter(userWeight.date)}</p>}
        {userWeight.length > 1 && null }
        <p><button className="btn btn-primary mb-1 px-5 py-2" data-bs-toggle="modal" data-bs-target="#updateWeightModal">
               Update
           </button>
        </p>
        <p>
          <button className="btn btn-primary px-5 py-2" data-bs-toggle="modal" data-bs-target="#pastWeightModal">
                Past weights
          </button>
        </p>
        
      </div>


      <div className="modal fade" id="setWeightModal" tabIndex="-1" aria-labelledby="setWeightModal" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="setWeightModal" style={{color: 'black'}}>Set Weight</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form action="login-form" onSubmit={handleSubmit}>
              <div className="modal-body">
                  <div className="modal-input-container">
                    <input
                      type="number"
                      name="setWeight"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      id="emailAddress"
                      placeholder="Enter your weight"
                      required=""
                      style={{border: '1px solid'}}
                    />
                  </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary">Set</button>
              </div>
              </form>
            </div>
          </div>
      </div> 

      <div className="modal fade" id="updateWeightModal" tabIndex="-1" aria-labelledby="updateWeightModal" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="updateWeightModal" style={{color: 'black'}}>Update Weight</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form action="login-form" onSubmit={handleUpdate}>
              <div className="modal-body">
                  <div className="modal-input-container">
                    <input
                      type="number"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      placeholder="Update your weight"
                      required=""
                      style={{border: '1px solid'}}
                    />
                  </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" data-bs-dismiss="modal">Update</button>
              </div>
              </form>
            </div>
          </div>
      </div> 

      <div className="modal fade" id="pastWeightModal" tabIndex="-1" aria-labelledby="pastWeightModal" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{width: '700px'}}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="pastWeightModal" style={{color: 'black'}}>Past Weight</h1>
                <button className="btn btn-outline-primary" onClick={downloadChartAsImage} style={{marginLeft: '350px'}}>Download</button>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="">
                  {pastUserWeight === null ? (
                        <p>Enter weight</p>
                    ) : (
                      <div ref={weightChart}>
                      <LineChart
                      width={600}
                      height={500}
                      data={pastUserWeight.history.slice(0, -1)}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={"date"} />
                      <YAxis type="number" domain={[0, 150]}/>
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="weight" stroke="#ff0000" activeDot={{ r: 8 }} />
                    </LineChart>
                    </div>
                    )
                    }
                </div>
              </div>
            </div>
          </div>
      </div> 

    <div className="row mt-4">
      <div className="col-md-6 mx-auto" style={{width: '500px'}}>
        <div className="card mx-auto" style={{width: '500px'}}>
          <div className="card-body">
            <h2 className="text-center mb-4">Targets</h2>
              <ul className="list-group list-group-flush">
                {userGoals.length === 0 ? <label className="text-center" style={{fontSize: '18px'}}>No targets set </label> : 
                userGoals.map((data, index) => (
                  <div key={index}>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <label>{data.goals}</label>
                      <button onClick={() => handleGoalRemove(data.id)} className="btn btn-outline-success">Completed</button>
                    </li>
                  </div>
                ))}
              </ul>
           <div className="button-container">   
            <button className="btn btn-primary mt-5" data-bs-toggle="modal" data-bs-target="#setTargetModal">Add</button>   
           </div>    
          </div>
        </div>

        <div className="modal fade" id="setTargetModal" tabIndex="-1" aria-labelledby="setTargetModal" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="setTargetModal" style={{color: 'black'}}>Set target</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form action="login-form" onSubmit={handleGoalSet}>
              <div className="modal-body">
                  <div className="modal-input-container">
                    <input
                      type="text"
                      value={goals}
                      onChange={e => setGoals(e.target.value)}
                      placeholder="Enter target"
                      required=""
                      style={{border: '1px solid', width: '450px'}}
                    />
                  </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" data-bs-dismiss="modal">Set</button>
              </div>
              </form>
            </div>
          </div>
      </div> 

    </div>

    </div>

    </div>

    </div>



   
    
    
    </ProgWithHeaderLayout>
        


);
    
};
