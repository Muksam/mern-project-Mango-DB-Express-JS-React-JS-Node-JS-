import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteEducation } from '../../actions/profile';

const Education = ({ education, deleteEducation }) => {
  const educations = education.map((edu) => (
    <tr key={edu.id}>
      <td className='sm-hide'>{edu.school}</td>
      <td className='sm-hide'>{edu.degree}</td>
      <td>
        <Moment format='YYYY/MM/DD'>{edu.form}</Moment>-
        {edu.to === null ? (
          'Now'
        ) : (
          <Moment format='YYYY/MM/DD'>{edu.form}</Moment>
        )}
      </td>
      <button
        onClick={() => deleteEducation(edu._id)}
        className='btn btn-danger'
      >
        Delete
      </button>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className='my-2'>Education Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='sm-hide'>Degree</th>
            <th className='sm-hide'>Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
