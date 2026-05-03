"use client";

import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdPersonSearch } from 'react-icons/md';
import StudentCard from '../studentCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudents, deleteStudent, updateStudent } from '@/api/student.api';
import { toast } from 'react-hot-toast';

const Students = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: studentsResponse, isLoading, isError } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents
  });

  const students = studentsResponse?.data || [];

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      queryClient.invalidateQueries(['seats']);
      toast.success('Student removed successfully');
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateStudent(id, { status }),
    onMutate: async (newStudent) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData(['students']);

      queryClient.setQueryData(['students'], (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map(s => 
            s._id === newStudent.id ? { ...s, status: newStudent.status } : s
          )
        };
      });

      return { previousStudents };
    },
    onError: (err, newStudent, context) => {
      queryClient.setQueryData(['students'], context.previousStudents);
      toast.error('Failed to update status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onSuccess: () => {
      toast.success('Status updated');
    }
  });

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <div className="p-xl">Loading students...</div>;
  if (isError) return <div className="p-xl text-red-500">Error loading students</div>;

  return (
    <div className="students-container">
      <div className="students-header">
        <h1>Student Directory</h1>
        <p>Manage enrolled library members and track attendance.</p>
      </div>

      <div className="control-bar">
        <div className="search-input-wrapper">
          <MdSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <MdFilterList color="var(--muted)" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select student-filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <div className="student-grid">
          {filteredStudents.map((student) => (
            <StudentCard 
              key={student._id} 
              student={{
                ...student,
                isUpdating: statusMutation.isPending && statusMutation.variables?.id === student._id,
                isDeleting: deleteMutation.isPending && deleteMutation.variables === student._id
              }} 
              onRemove={(id) => deleteMutation.mutate(id)}
              onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <MdPersonSearch className="empty-icon" />
          <h3>No students found</h3>
          <p>Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default Students;
