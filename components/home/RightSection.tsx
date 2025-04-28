"use client"
 import { useAppContext } from '@/context/AppContext';
import React from 'react';
import AuthCard from '../auth/AuthCard';
import FeatureCardNavigation from './FeatureCardNavigation';
import Loader from '../ui/Loader';

function RightSection() {
  const { data, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="h-72 w-60 flex items-center justify-center">
        <Loader className="text-black" />
      </div>
    );
  }

  return data.isLoggedIn ? (
    <FeatureCardNavigation />
  ) : (
    <AuthCard />
  );
}

export default RightSection;