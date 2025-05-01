import { useContext } from 'react';
import { TasteProfileContext } from '../context/TasteProfileContext';

export const useTasteProfile = () => {
  return useContext(TasteProfileContext);
};