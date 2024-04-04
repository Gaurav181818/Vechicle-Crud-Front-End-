
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./vehicle.css";
import DeleteConfirmation from './DeleteConfirmation';
import Header from './Header';
import { Footer } from './Footer';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';
import ReactTable from "react-table";  




export const Vehicle = () => {
    const [vehicles, setVehicles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [deleteVehicleId, setDeleteVehicleId] = useState(null); 
    const [id, setUpdateVehicleId] = useState(null); 
    const [updateData, setUpdateData] = useState({ carModel: "", carMaker: "", yearofMfg: "", basePrice: "" });
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [yearOfMfgError, setYearOfMfgError] = useState("");


   
    

    


    useEffect(() => {
        fetchVehicles();
    }, []);



    const fetchVehicles = async () => {
        try {
            const response = await axios.get('https://localhost:7106/api/Vehicle/GetAll');
            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };


    const deleteVehicle = async (id) => {
        try {
            await axios.delete(`https://localhost:7106/api/Vehicle/Delete/${id}`);
            fetchVehicles();
            closeDeleteModal();
            toast.error("Vechicle Deleted Sucessfully")
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    const openDeleteModal = (id) => {
        setDeleteVehicleId(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setDeleteVehicleId(null);
        setShowDeleteModal(false);
    };

    const handleUpdate = (id) => {
        const selectedVehicle = vehicles.find(vehicle => vehicle.id === id);
        setUpdateData(selectedVehicle);
        setUpdateVehicleId(id);
        setIsAddingNew(false); // Set adding new to false when updating
        toggleModal();
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "yearofMfg" && value.length !== 4) {
            setYearOfMfgError("Please enter a valid year (4 digits).");
        } else {
            setYearOfMfgError("");
        }

        setUpdateData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };



    const extractYear = (dateString) => {
        return dateString.substring(0, 4); // Extracts first 4 characters (year) from the date string
    };

    
    const toggleModal = () => {
        setShowModal(!showModal);
    };


    const resetModal = () => {
        setUpdateData({ carModel: "", carMaker: "", yearofMfg: "", basePrice: "" });
        setUpdateVehicleId(null);
        toggleModal();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const { carModel, carMaker, yearofMfg, basePrice } = updateData;
        const data = { carModel, carMaker, yearofMfg, basePrice };
    
        if (id === null) {
            // If updateVehicleId is null, it means it's a new vehicle
            axios.post('https://localhost:7106/api/Vehicle/Create', data)
                .then((response) => {
                    console.log(response);
                    resetModal(); // Reset the modal after successful creation
                    fetchVehicles();
                    toast.success('Vehicle Added Successfully ');
                  
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            // Otherwise, it's an update operation
            axios.put(`https://localhost:7106/api/Vehicle/Update/${id}`, data)
                .then((response) => {
                    console.log(response);
                    resetModal(); // Reset the modal after successful update
                    fetchVehicles();
                    toast.warning('Vehicle Updated Successfully ');
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

  return (
    <div>
        <Header/>
        <ToastContainer/>
        

        <div className='vehicletable'>
            <h4 className="text-center">Vehicle Data List</h4>
            <div className='addvehicle'>
                 <button  className="btn btn-primary" onClick={toggleModal}>Add Vehicle </button>
            </div>
            <div className="table-responsive">
                      
            <table className= "table  table-hover table-bordered">
                <thead className="table-dark" id='hedings'>
                    <tr>
                        <th>Car Model</th>
                        <th>Car Maker</th>
                        <th>Year of Manufacture</th>
                        <th>Base Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map(vehicle => (
                        <tr key={vehicle.id}>
                            <td>{vehicle.carModel}</td>
                            <td>{vehicle.carMaker}</td>
                            <td>{extractYear(vehicle.yearofMfg)}</td>
                            <td>{vehicle.basePrice}</td>
                            <td>
                                <div className='buttons'>
                                <button  className="btn btn-info" onClick={() => handleUpdate(vehicle.id)}>Update </button>
                                <button style={{marginLeft: "10px"}}  className="btn btn-danger"   onClick={() => openDeleteModal(vehicle.id)}>Delete </button>
                                {/* <button style={{marginLeft: "10px"}} className="btn btn-info">View </button> */}
                                </div>
                              
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>



            </div>
           

            </div>

            {showModal && (

                    <div className="overlay">
                        <div className="modal fade show"  tabIndex="-1" style={{display: 'block'}}>
                          <div className="modal-dialog  modal-lg">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Add Vehicle</h5>
                                <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close"onClick={resetModal}></button>
                              </div>
                              <div className="modal-body">
                              <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-12">
                                <form   onSubmit={handleSubmit}  id="vehicleform" className="row form1">


                                    <div className="col-md-6 form-row">
                                        <div className="form-group">
                                            <label htmlFor="carModel">Car Model</label>
                                            <input className="form-control" type="text"  id="carModel" name="carModel"  value={updateData.carModel} onChange={handleInputChange} required/>
                                        </div>
                                    </div>

                                    <div className="col-md-6 form-row">
                                        <div className="form-group">
                                            <label htmlFor="carmaker">Car Maker</label>
                                            <input className="form-control" type="text"  id="carmaker" name="carMaker"  value={updateData.carMaker} onChange={handleInputChange}  required/>
                                        </div>
                                    </div>

                                    <div className="col-md-6 form-row">
                                        <div className="form-group">
                                            <label htmlFor="yearofmfg">Year Of Manufacturing &#128197;</label>
                                            <div className="input-group">
                                            <span className="input-group-text">YEAR</span>
                                            <input className="form-control" type="text"  id="yearofmfg" name="yearofMfg"  value={updateData.yearofMfg} onChange={handleInputChange}  required/>
                                           
                                            {yearOfMfgError && <div className="text-danger">{yearOfMfgError}</div>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 form-row">
                                        <div className="form-group">
                                            <label htmlFor="baseprice">Base Price (₹)</label>

                                            <div className="input-group">
                                            <span className="input-group-text">₹</span>
                                            <input className="form-control" type="text"  id="baseprice" name="basePrice" value={updateData.basePrice} onChange={handleInputChange} required/>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="modal-footer my-modal-footer">
                                          <button type="button" className="btn btn-secondary" data-dismiss="modal"onClick={resetModal}>Close</button>
                                          <button type="submit" className="btn btn-primary">Save changes</button>
                                    </div>

                                </form>

                            </div>

                        </div>
                    </div>
                    </div>
                                
                              </div>
                             
                            </div>
                          </div>
                        </div>                      
            )}
              
                <DeleteConfirmation
                show={showDeleteModal}
                onClose={closeDeleteModal}
                onConfirm={() => deleteVehicle(deleteVehicleId)}
            />
            <Footer/>
        </div>
  )
}

