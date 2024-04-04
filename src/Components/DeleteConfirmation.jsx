import React,{useState} from 'react'
import "./deleteconfirmation.css";

const DeleteConfirmation = ({ show, onClose, onConfirm }) => {

    if (!show) return null;

  return (
    <div className='overlay'>
   <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirmation</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete this item?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
     </div>   
  )
}

export default DeleteConfirmation