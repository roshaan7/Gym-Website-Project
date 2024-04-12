import ProgWithHeaderLayout from "../../styles/ProgWithHeaderLayout";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label} from 'recharts';
import FileSaver from "file-saver";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

export default function Progress() {

    const client = axios.create({
        baseURL: 'http://127.0.0.1:8000'
    });

    const token = sessionStorage.getItem('authenticateTokens');

    if(token) {
        const decodeToken = jwtDecode(token);
        var userID = decodeToken.user_id
        var username = decodeToken.username;
  
    }

    const [exercises, setExercises] = useState([])

    const headers = {
        'Content-Type': 'application/json',
    }

    const url3 = '/userapi/api/exercise'

    useEffect(() => {
  
    client.get(url3, {headers : headers}).then((response) => {

        if (response.status === 200) {
        if (response.data !== null && response.data !== undefined) {
            setExercises(response.data);
        } else {
            console.log("Exercises couldn't be found");
        }
        }
    }).catch((error) => {
        console.error("Error fetching:", error);
    });

    }, [])

    const targetMuscles = [...new Set(exercises.map(muscleGroup => muscleGroup.target_muscle))]

    //Getting the recently created workout_ID
    const [workout, setWorkout] = useState([])
    const [allWorkout, setAllWorkout] = useState([])

    const url = `/userapi/api/workout/${userID}`

    useEffect(() => {

        const getWorkouts = () => {

        client.get(url, {headers : headers}).then((response) => {
            if (response.status === 200) {
            if (response.data !== null && response.data !== undefined) {
                setWorkout(response.data);
                setAllWorkout(response.data);
            } else {
                console.log("Exercises couldn't be found");
            }
            }
        }).catch((error) => {
            console.error("Error fetching:", error);
        });
    
        }

        getWorkouts();
        const interval = setInterval(getWorkouts, 1500);
        return () => clearInterval(interval);


        }
  
        , [userID])

        let lastElement = workout[workout.length - 1]
        const lastElementID = lastElement ? lastElement.workout_ID : undefined


        const [selectedExerciseID, setSelectedExerciseID] = useState('')

        const handleExerciseChoice = (e) => {
            setSelectedExerciseID(e.target.value);
        };

        const [updateWorkoutExID, setUpdatedWorkoutExID] = useState('')
        const handleUpdateExerciseChoice = (e) => {
            setUpdatedWorkoutExID(e.target.value)
        }

        const [workoutDetails, setWorkoutDetails] = useState([])
        const [chosenWorkoutID, setChosenWorkoutID] = useState('')

        const handleChosenWorkoutID = (id) => {
            setChosenWorkoutID(id)
        }


        const chosenURL = `/userapi/api/workout/details/${chosenWorkoutID}`

        useEffect(() => {

            const getWorkoutsDetails = () => {

            client.get(chosenURL, {headers : headers}) 
                .then(function (response) {
                if (response.status === 200) {
                    if (response.data !== null && response.data !== undefined) {
                        setWorkoutDetails(response.data);
                    } else {
                        console.log("Details couldn't be found");
                    }
                    }
                }).catch((error) => {
                    console.error("Error fetching:", error);
            });
            }

            getWorkoutsDetails();
            const interval2 = setInterval(getWorkoutsDetails, 1000);
            return () => clearInterval(interval2);
            
        },[chosenURL])

        const [recentWorkoutDetails, setRecentWorkoutDetails] = useState([])

        const lastWorkoutURL = `/userapi/api/workout/details/${lastElementID}`

        useEffect(() => {

            const getLastWorkoutsDetails = () => {

            client.get(lastWorkoutURL, {headers : headers}) 
                .then(function (response) {
                    if (response.status === 200) {
                        if (response.data !== null && response.data !== undefined) {
                            setRecentWorkoutDetails(response.data);
                        } else {
                            console.log("Details couldn't be found");
                        }
                        }
                    }).catch((error) => {
                        console.error("Error fetching:", error);
            });


            }

            getLastWorkoutsDetails();
            const interval3 = setInterval(getLastWorkoutsDetails, 1000);
            return () => clearInterval(interval3);
            
            

        },[lastWorkoutURL])

        const workoutInfo = "Check out my workout, try it and let me know how you find it:\n\n" + workoutDetails.map(information => `Exercise: ${information.exercise_name}, Weight: ${information.weight}kg, Reps: ${information.number_of_reps}`).join('\n');


    const [publicChoice, setPublicChoice] = useState(true)

    const handlePublicChoice = (e) => {

      setPublicChoice(e.target.value)

    }

    const [file, setFile] = useState(null)
    const [isFile, setIsFile] = useState(false)

    const handleFileChange = (e) => {

      setFile(e.target.files[0])
      setIsFile(true)

    }

    function handlePostSend(e) {
      e.preventDefault()
      const formData = new FormData();
      formData.append('user', userID);
      formData.append('post_content', workoutInfo);
      formData.append('is_Public', publicChoice);
      if (isFile) {
        formData.append('uploaded_content', file);
      }
      const newHeader = {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    client.post("/userapi/api/post/create", formData, newHeader) 
      .then(function (response) {
    if (response.status === 201) {
        setPublicChoice(true)
        setFile(null)
        setIsFile(false)
        Swal.fire({
          title: 'Post sent',
          icon: 'success'
        });
    } })
    
    .catch ((error) => {
      Swal.fire({
        position: 'top-right',
        icon: 'error',
        title: 'Error while sending post',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
        toast: true
      })
    })
    }


        //Whichever name the user choose this gets the id corresponding to the exercise

        const [workoutChoiceID, setWorkoutChoiceID] = useState('')

        const handleWorkoutChoice = (e) => {
            setWorkoutChoiceID(e.target.value);
        };

        const [eachExerciseDetails, setEachExerciseDetails] = useState([])

        const url5 = `/userapi/api/workout/exercise/${userID}/${workoutChoiceID}`

        useEffect(() => {

            const getExerciseDetails = () => {

                client.get(url5, {headers : headers}).then((response) => {

                    if (response.status === 200) {
                    if (response.data !== null && response.data !== undefined) {
                        setEachExerciseDetails(response.data);
                    } else {
                        console.log("Past user weight data is not available.");
                    }
                    }
                }).catch((error) => {
                    console.error("Error fetching:", error);
                });


            }

            getExerciseDetails();
            const interval5 = setInterval(getExerciseDetails, 1500);
            return () => clearInterval(interval5);
        
        

        }, [url5])

        workoutDetails.sort((fir, sec) => {
            if (fir.exercise_name < sec.exercise_name) {
                return -1;
            } else if (fir.exercise_name > sec.exercise_name) {
                return 1;
            } else {
                return fir.set_number - sec.set_number
            }
        });

        const [date, setDate] = useState('')
        const [recentWorkoutStarted, setRecentWorkoutStarted] = useState(false)

        const handleDateChoose = (e) => {
            setDate(e.target.value);
        }

    function handleSubmit(e) {
        e.preventDefault();
        const body = JSON.stringify({
            user: userID,
            date: date,
        })
      
        client.post("/userapi/api/workout/", body, {headers : headers}) 
          .then(function (response) {
        if (response.status === 201) {
              setDate('')
              setRecentWorkoutStarted(true)
              setAddDetailsList([{ set: "", weight: "", reps:""}])
              Swal.fire({
                position: 'top-right',
                icon: 'success',
                title: 'Workout created',
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 1200,
                toast: true
              })
        } else {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Workout creation error',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
          }
        })
      };

      const handleRecentFalse = () => {
        setRecentWorkoutStarted(false)
      }

      const [addDetailsList, setAddDetailsList] = useState([{ set: "", weight: "", reps: ""}])
      const element = addDetailsList.length-1

      const setNumber = addDetailsList[element].set;
      const weightNumber = addDetailsList[element].weight;
      const repNumber = addDetailsList[element].reps;

      const detailsInputChange = (e, index) => {

        const { name, value } = e.target;
        const newList = [...addDetailsList];
        newList[index][name] = value;
        setAddDetailsList(newList);

      }

    function handleExerciseSubmit(e) {
        e.preventDefault();
        const body = JSON.stringify({
            workout_id: lastElementID,
            exercise_id: selectedExerciseID,
            set_number: setNumber,
            weight: weightNumber,
            number_of_reps: repNumber
        })

        client.post("/userapi/api/workout/add/", body, {headers : headers}) 
          .then(function (response) {
           
        if (response.status === 201) {
              setAddDetailsList([{reps:""}])
              Swal.fire({
                position: 'top-right',
                icon: 'success',
                title: 'Exercise added',
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 1200,
                toast: true
              })
        } 
        })
        .catch (error => {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Error while adding exercise',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
        })
      
        
      };

      const handleWorkoutCancel = (id) => {
        //e.preventDefault();
        client.delete(`/userapi/api/workout/remove/${id}`, {headers : headers}) 
          .then(function (response) {
        if (response.status === 204) {
            setRecentWorkoutStarted(false)
            Swal.fire({
              position: 'top-right',
              icon: 'success',
              title: 'Workout cancelled',
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 1200,
              toast: true
            })
        } else {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Error while cancelling workout',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
          }
        })
      };

      const handleWorkoutRemove = (id) => {
        //e.preventDefault();
        client.delete(`/userapi/api/workout/remove/${id}`, {headers : headers}) 
          .then(function (response) {
        if (response.status === 204) {
          Swal.fire({
            position: 'top-right',
            icon: 'success',
            title: 'Workout removed',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
        } else {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Error while removing workout',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
          }
        })
      };

    const [updateDetailsList, setUpdateDetailsList] = useState([{ set: "", weight: "", reps: ""}])
      const elementUpdate = updateDetailsList.length-1

      const updatedSetNumber = updateDetailsList[elementUpdate].set;
      const updatedWeightNumber = updateDetailsList[elementUpdate].weight;
      const updatedRepNumber = updateDetailsList[elementUpdate].reps;

        const updatedInputChange = (e, index) => {

        const { name, value } = e.target;
        const newList = [...updateDetailsList];
        newList[index][name] = value;
        setUpdateDetailsList(newList);

      }

    function handleWorkoutUpdate(e) {
        e.preventDefault();
        const body = JSON.stringify({
            workout_id: chosenWorkoutID,
            exercise_id: updateWorkoutExID,
            set_number: updatedSetNumber,
            weight: updatedWeightNumber,
            number_of_reps: updatedRepNumber
        })

        client.post("/userapi/api/workout/add/", body, {headers : headers}) 
          .then(function (response) {
           
        if (response.status === 201) {
            setUpdateDetailsList([{ set: "", weight: "", reps:""}])
            Swal.fire({
              position: 'top-right',
              icon: 'success',
              title: 'Workout updated',
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 1200,
              toast: true
            })
        } 
        })

        .catch (error => {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Error while updating workout',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
        })
      
        
      };


      const handleSetRemove = (id) => {
        //e.preventDefault();
        client.delete(`/userapi/api/set/remove/${id}`, {headers : headers}) 
          .then(function (response) {
        if (response.status === 204) {
          Swal.fire({
            position: 'top-right',
            icon: 'success',
            title: 'Set removed',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
        } else {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Error while removing set',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
          }
        })
      };

      const [chosenSetId, setChosenSetId] = useState('')

      const handleChosenSetID = (id) => {
        setChosenSetId(id)
      }


    const [updateWeight, setUpdateWeight] = useState('')
    const [updateReps, setUpdateReps] = useState('')

    function handleSetUpdate(e) {
        e.preventDefault();
        const body = {
            "weight": updateWeight,
            "number_of_reps": Number(updateReps)
        }
      
        client.put(`/userapi/api/set/update/${chosenSetId}`, body, {headers : headers}) 
          .then(function (response) {
        if (response.status === 200) {
              setUpdateWeight('')
              setUpdateReps('')
              Swal.fire({
                position: 'top-right',
                icon: 'success',
                title: 'Set updated',
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 1200,
                toast: true
              })
        } })

        .catch (error => {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Error while updating set',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
        })
      
      };

      const calculateOneRepMax = (weight, repNumber) => {
        let result = weight / (1.0278 - 0.0278 * repNumber)
        return parseFloat(result.toFixed(2))
      }

      function dateFormatter(x) {

        const splitDate = x.split('-');
        const day = splitDate[2];
        const month = splitDate[1];
        const year = splitDate[0];
      
        return `${day}-${month}-${year}`
      
      
      }
        
      const progressChart = useRef(null);

      const downloadChartAsImage = () => {
        let source = new XMLSerializer().serializeToString(progressChart.current.querySelector('svg'));
        const sBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(sBlob);
      
        const img = new Image();
        img.onload = () => {
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

            <div className="container-lg-1 py-5">
                <div className="row align-items-start">
                    <div className="col-sm-6 text-center mt-4 mx-4">
                        <h1>Workout Tracker:</h1>
                        <button className="mt-3 btn btn-primary px-4 py-2" data-bs-toggle="modal" data-bs-target="#chooseDateModal">Enter workout</button>
                        {recentWorkoutStarted && 
                        <p>
                            <h3 className="mt-4">Current Workout:</h3>
                            {recentWorkoutDetails.map((data, index) => (
                                <div key={index}>
                                    <label className="mx-2 mb-2">Exercise: {data.exercise_name}</label>
                                    <label className="mx-2">Weight: {data.weight} (kg)</label>
                                    <label className="mx-2">Reps: {data.number_of_reps}</label>
                                    <label className="mx-2">1RM: {calculateOneRepMax(data.weight, data.number_of_reps)}</label>
                                    <button className="btn btn-secondary btn-sm mx-2 mb-2" data-bs-toggle="modal" data-bs-target="#updateSetModal" onClick={() => handleChosenSetID(data.set_id)}>Edit</button>
                                    <button className="btn btn-danger btn-sm mb-2" onClick={() => handleSetRemove(data.set_id)}>&#10005;</button>
                                </div>
                            ))}
                            <button className="btn btn-primary mt-2 mx-5" data-bs-toggle="modal" data-bs-target="#workoutDetailsModal">Add</button>
                            <button type="button" className="btn btn-danger mt-2" onClick={() => handleWorkoutCancel(lastElementID)}>Cancel</button>
                            <p><button className="btn btn-success mt-2" onClick={() => handleRecentFalse()}>Finish</button></p>
                        </p>}
                    </div>
                    <div className="col-lg-3 mt-4 mx-auto">
                        <h1 className="text-center">Workouts:</h1>
                        {allWorkout.map((data, index) => (
                          <div key={index} className="mb-3 text-center">
                            {allWorkout.length !== 0 && <span className="mx-3">Date: {dateFormatter(data.date)}</span>}
                            <button className="btn btn-primary mx-3" onClick={() => handleChosenWorkoutID(data.workout_ID)} data-bs-target="#viewCurrentWorkoutModal" data-bs-toggle="modal">View</button>
                            <button onClick={() => handleWorkoutRemove(data.workout_ID)} className="btn btn-danger mx-2">Remove</button>
                          </div>      
                        ))}
                    </div>
                    <div className="col text-center mt-4">
                        <h2 className="text-center">Exercise progression:</h2>
                        <select onChange={handleWorkoutChoice} value={workoutChoiceID} className="mt-2">
                            {targetMuscles.map(muscleGroup => (
                                <optgroup label={muscleGroup}>
                                    {exercises.filter(muscle => muscle.target_muscle === muscleGroup).map((exercise) => (
                                        <option key={exercise.exercise_ID} value={exercise.exercise_ID}>
                                            {exercise.exercise_name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <button onClick={downloadChartAsImage} className="mx-4 btn btn-primary btn-sm">Download</button>
                        <div className="d-flex justify-content-center align-item-center mt-3">
                          <div ref={progressChart}>
                          <LineChart
                              width={700}
                              height={300}
                              data={eachExerciseDetails}
                              >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" domain={[0, 20]}>
                                  <Label value={"Date"} dy={18} position={"insideBottomRight"}/>
                              </XAxis>
                              <YAxis type="number" domain={[0, 'auto']} dataKey={"weight"}>
                                  <Label value={"Weight (kg)"} angle={270} dx={-18} />
                              </YAxis>
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="weight" stroke="#ff0000" activeDot={{ r: 8 }} />
                          </LineChart>
                          </div>
                        </div> 
                    </div>
                </div>
                
            </div>

        <div className="modal fade" id="chooseDateModal" tabIndex="-1" aria-labelledby="chooseDateModal" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="chooseDateModal" style={{color: 'black'}}>Choose Date</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body mx-auto">
                <input type="date" value={date} onChange={handleDateChoose}/>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSubmit} data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#workoutDetailsModal">Create</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="workoutDetailsModal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="workoutDetailsModal" aria-hidden="true" data-bs-keyboard="false">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="workoutDetailsModal" style={{color: 'black'}}>Enter workout details</h1>
                <button type="button" className="btn btn-danger mt-2" onClick={() => handleWorkoutCancel(lastElementID)} data-bs-dismiss="modal">Cancel</button>
              </div>
              <div className="modal-body">
                <p>
                    <select onChange={handleExerciseChoice} value={selectedExerciseID} >
                        {targetMuscles.map(muscleGroup => (
                            <optgroup label={muscleGroup}>
                                {exercises.filter(muscle => muscle.target_muscle === muscleGroup).map((exercise) => (
                                    <option key={exercise.exercise_ID} value={exercise.exercise_ID}>
                                        {exercise.exercise_name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </p>
                    {addDetailsList.map((data, index) => (
                    <div key={index}>
                    <p>
                        <span className="me-3">Set:</span>
                        <input
                            name="set"
                            placeholder="Set number"
                            type="number"
                            id="set"
                            value={data.set}
                            onChange={(e) => detailsInputChange(e, index)}
                            required="true"
                        />
                    </p> 
                    <p>
                        <span className="me-3">Weight:</span>
                        <input
                            name="weight"
                            placeholder="Weight"
                            type="number"
                            id="weight"
                            value={data.weight}
                            onChange={(e) => detailsInputChange(e, index)}
                        />    
                    </p>
                    <span className="me-3">Reps:</span>
                    <input
                        name="reps"
                        placeholder="Reps"
                        type="number"
                        id="reps"
                        value={data.reps}
                        onChange={(e) => detailsInputChange(e, index)}
                    />
                    </div>
                    ))}
                </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleExerciseSubmit} data-bs-dismiss="modal">Submit</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="viewCurrentWorkoutModal" tabIndex="-1" aria-labelledby="viewCurrentWorkoutModal" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="viewCurrentWorkoutModal" style={{color: 'black'}}>Workout Details</h1>
                <button className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#sendPostModal" style={{marginLeft: '450px'}}>Share workout</button>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body mx-auto">
                {workoutDetails.map((data, index) => (
                    <div key={index} className="mb-2">
                        <label className="mx-2 mb-2">Exercise: {data.exercise_name}</label>
                        <label className="mx-2">Weight: {data.weight} (kg)</label>
                        <label className="mx-2">Reps: {data.number_of_reps}</label>
                        <label className="mx-2">1RM: {calculateOneRepMax(data.weight, data.number_of_reps)}</label>
                        <button className="btn btn-info btn-sm me-2" data-bs-toggle="modal" data-bs-target="#updateSetModal" onClick={() => handleChosenSetID(data.set_id)}>Update</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleSetRemove(data.set_id)}>&#10005;</button>
                    </div>
                ))}
                <div className="d-flex justify-content-center">
                    <button data-bs-target="#updateWorkoutModal" data-bs-toggle="modal" className="btn btn-primary">Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="updateSetModal" tabIndex="-1" aria-labelledby="updateSetModal" aria-hidden="true" data-bs-keyboard="false">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="updateSetModal" style={{color: 'black'}}>Edit Set</h1>
              </div>
              <div className="modal-body">
              <input
                    type="number"
                    name="set"
                    value={updateWeight}
                    onChange={e => setUpdateWeight(e.target.value)}
                    placeholder="Weight"
                    required=""
                    className="me-2"
                />
                <input
                    type="number"
                    name="set"
                    value={updateReps}
                    onChange={e => setUpdateReps(e.target.value)}
                    placeholder="Reps"
                    required=""
                />
                </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSetUpdate} data-bs-dismiss="modal">Submit</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="updateWorkoutModal" tabIndex="-1" aria-labelledby="updateWorkoutModal" aria-hidden="true" data-bs-keyboard="false">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="updateWorkoutModal" style={{color: 'black'}}>Enter workout details</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <p>
                <select onChange={handleUpdateExerciseChoice} value={updateWorkoutExID}>
                    {targetMuscles.map(muscleGroup => (
                            <optgroup label={muscleGroup}>
                                {exercises.filter(muscle => muscle.target_muscle === muscleGroup).map((exercise) => (
                                    <option key={exercise.exercise_ID} value={exercise.exercise_ID}>
                                        {exercise.exercise_name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                </select> 
                </p>
                    {updateDetailsList.map((data, index) => (
                    <div key={index}>
                    <p>
                        <span className="me-3">Set:</span>
                        <input
                            name="set"
                            placeholder="Set number"
                            type="number"
                            id="set"
                            value={data.set}
                            onChange={(e) => updatedInputChange(e, index)}
                            required="true"
                        />
                    </p> 
                    <p>
                        <span className="me-3">Weight:</span>
                        <input
                            name="weight"
                            placeholder="Weight"
                            type="number"
                            id="weight"
                            value={data.weight}
                            onChange={(e) => updatedInputChange(e, index)}
                        />    
                    </p>
                    <span className="me-3">Reps:</span>
                    <input
                        name="reps"
                        placeholder="Reps"
                        type="number"
                        id="reps"
                        value={data.reps}
                        onChange={(e) => updatedInputChange(e, index)}
                    />
                    </div>
                    ))}
                </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleWorkoutUpdate} data-bs-dismiss="modal" data-bs-target="#viewCurrentWorkoutModal" data-bs-toggle="modal">Submit</button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="sendPostModal" tabindex="-1" aria-labelledby="sendPostModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="sendPostModalLabel" style={{color: 'black'}}>Share a workout</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="login-form" onSubmit={handlePostSend}>
                <div class="modal-body">
                    <div className="send-post-container mb-3">
                        <textarea
                        type="text"
                        required=""
                        className="send-post-input"
                        placeholder="Type something"
                        value={workoutInfo}
                        />
                    </div>
                    <select value={publicChoice} onChange={handlePublicChoice} className="mb-3">
                        <option value={true}>Anyone can view</option>
                        <option value={false}>Only friends can view</option>
                    </select>
                    <p className="fileName">Add image or vid: <input type="file" onChange={handleFileChange}/></p>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Post</button>
                </div>
                </form>
                </div>
            </div>
        </div>
                
        </ProgWithHeaderLayout>

    )

}
