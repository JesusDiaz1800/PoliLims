
"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import type { EnsayoPHI } from '@/context/data-context';
import { Combobox } from '@/components/ui/combobox';
import { useToast } from '@/hooks/use-toast';

const productosPHI = [
    { value: "90mm x 12m SMARTCOLORS PN-6 SDR-27,6", label: "90mm x 12m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "90mm x 6m SMARTCOLORS PN-6 SDR-27,6", label: "90mm x 6m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "90mm x 50m SMARTCOLORS PN-6 SDR-27,6", label: "90mm x 50m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "90mm x 100m SMARTCOLORS PN-6 SDR-27,6", label: "90mm x 100m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "90mm x 6m SMARTCOLORS PN-20 SDR-9", label: "90mm x 6m SMARTCOLORS PN-20 SDR-9" },
    { value: "90mm x 12m SMARTCOLORS PN-20 SDR-9", label: "90mm x 12m SMARTCOLORS PN-20 SDR-9" },
    { value: "90mm x 50m SMARTCOLORS PN-20 SDR-9", label: "90mm x 50m SMARTCOLORS PN-20 SDR-9" },
    { value: "90mm x 100m SMARTCOLORS PN-20 SDR-9", label: "90mm x 100m SMARTCOLORS PN-20 SDR-9" },
    { value: "90mm x 150m SMARTCOLORS PN-20 SDR-9", label: "90mm x 150m SMARTCOLORS PN-20 SDR-9" },
    { value: "90mm x 6m SMARTCOLORS PN-16 SDR-11", label: "90mm x 6m SMARTCOLORS PN-16 SDR-11" },
    { value: "90mm x 12m SMARTCOLORS PN-16 SDR-11", label: "90mm x 12m SMARTCOLORS PN-16 SDR-11" },
    { value: "90mm x 50m SMARTCOLORS PN-16 SDR-11", label: "90mm x 50m SMARTCOLORS PN-16 SDR-11" },
    { value: "90mm x 100m SMARTCOLORS PN-16 SDR-11", label: "90mm x 100m SMARTCOLORS PN-16 SDR-11" },
    { value: "90mm x 200m SMARTCOLORS PN-16 SDR-11", label: "90mm x 200m SMARTCOLORS PN-16 SDR-11" },
    { value: "90mm x 150m SMARTCOLORS PN-16 SDR-11", label: "90mm x 150m SMARTCOLORS PN-16 SDR-11" },
    { value: "90mm x 6m SMARTCOLORS PN-12,5 SDR-13,6", label: "90mm x 6m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "90mm x 12m SMARTCOLORS PN-12,5 SDR-13,6", label: "90mm x 12m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "90mm x 50m SMARTCOLORS PN-12,5 SDR-13,6", label: "90mm x 50m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "90mm x 100m SMARTCOLORS PN-12,5 SDR-13,6", label: "90mm x 100m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "90mm x 150m SMARTCOLORS PN-12,5 SDR-13,6", label: "90mm x 150m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "90mm x 6m SMARTCOLORS PN-10 SDR-17", label: "90mm x 6m SMARTCOLORS PN-10 SDR-17" },
    { value: "90mm x 12m SMARTCOLORS PN-10 SDR-17", label: "90mm x 12m SMARTCOLORS PN-10 SDR-17" },
    { value: "90mm x 200m SMARTCOLORS PN-10 SDR-17", label: "90mm x 200m SMARTCOLORS PN-10 SDR-17" },
    { value: "90mm x 50m SMARTCOLORS PN-10 SDR-17", label: "90mm x 50m SMARTCOLORS PN-10 SDR-17" },
    { value: "90mm x 100m SMARTCOLORS PN-10 SDR-17", label: "90mm x 100m SMARTCOLORS PN-10 SDR-17" },
    { value: "90mm x 150m SMARTCOLORS PN-10 SDR-17", label: "90mm x 150m SMARTCOLORS PN-10 SDR-17" },
    { value: "90mm x 200m SMARTCOLORS PN-16 SDR-11", label: "90mm x 200m SMARTCOLORS PN-16 SDR-11" },
    { value: "90mm x 200m SMARTCOLORS PN-10 SDR-17", label: "90mm x 200m SMARTCOLORS PN-10 SDR-17" },
    { value: "90mm x 200m SMARTCOLORS PN-20 SDR-9", label: "90mm x 200m SMARTCOLORS PN-20 SDR-9" },
    { value: "75mm x 6m SMART PIPE/PP-RCT PN-16 S-3,2", label: "75mm x 6m SMART PIPE/PP-RCT PN-16 S-3,2" },
    { value: "75mm x 6m SMARTCOLORS PN-6 SDR-27,6", label: "75mm x 6m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "75mm x 12m SMARTCOLORS PN-6 SDR-27,6", label: "75mm x 12m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "75mm x 50m SMARTCOLORS PN-6 SDR-27,6", label: "75mm x 50m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "75mm x 100m SMARTCOLORS PN-6 SDR-27,6", label: "75mm x 100m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "75mm x 150m SMARTCOLORS PN-6 SDR-27,6", label: "75mm x 150m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "75mm x 6m SMARTCOLORS PN-20 SDR-9", label: "75mm x 6m SMARTCOLORS PN-20 SDR-9" },
    { value: "75mm x 12m SMARTCOLORS PN-20 SDR-9", label: "75mm x 12m SMARTCOLORS PN-20 SDR-9" },
    { value: "75mm x 50m SMARTCOLORS PN-20 SDR-9", label: "75mm x 50m SMARTCOLORS PN-20 SDR-9" },
    { value: "75mm x 100m SMARTCOLORS PN-20 SDR-9", label: "75mm x 100m SMARTCOLORS PN-20 SDR-9" },
    { value: "75mm x 150m SMARTCOLORS PN-20 SDR-9", label: "75mm x 150m SMARTCOLORS PN-20 SDR-9" },
    { value: "75mm x 6m SMARTCOLORS PN-16 SDR-11", label: "75mm x 6m SMARTCOLORS PN-16 SDR-11" },
    { value: "75mm x 12m SMARTCOLORS PN-16 SDR-11", label: "75mm x 12m SMARTCOLORS PN-16 SDR-11" },
    { value: "75mm x 50m SMARTCOLORS PN-16 SDR-11", label: "75mm x 50m SMARTCOLORS PN-16 SDR-11" },
    { value: "75mm x 100m SMARTCOLORS PN-16 SDR-11", label: "75mm x 100m SMARTCOLORS PN-16 SDR-11" },
    { value: "75mm x 150m SMARTCOLORS PN-16 SDR-11", label: "75mm x 150m SMARTCOLORS PN-16 SDR-11" },
    { value: "75mm x 6m SMARTCOLORS PN-12,5 SDR-13,6", label: "75mm x 6m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "75mm x 12m SMARTCOLORS PN-12,5 SDR-13,6", label: "75mm x 12m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "75mm x 50m SMARTCOLORS PN-12,5 SDR-13,6", label: "75mm x 50m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "75mm x 100m SMARTCOLORS PN-12,5 SDR-13,6", label: "75mm x 100m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "75mm x 150m SMARTCOLORS PN-12,5 SDR-13,6", label: "75mm x 150m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "75mm x 6m SMARTCOLORS PN-10 SDR-17", label: "75mm x 6m SMARTCOLORS PN-10 SDR-17" },
    { value: "75mm x 12m SMARTCOLORS PN-10 SDR-17", label: "75mm x 12m SMARTCOLORS PN-10 SDR-17" },
    { value: "75mm x 50m SMARTCOLORS PN-10 SDR-17", label: "75mm x 50m SMARTCOLORS PN-10 SDR-17" },
    { value: "75mm x 100m SMARTCOLORS PN-10 SDR-17", label: "75mm x 100m SMARTCOLORS PN-10 SDR-17" },
    { value: "75mm x 150m SMARTCOLORS PN-10 SDR-17", label: "75mm x 150m SMARTCOLORS PN-10 SDR-17" },
    { value: "315mm x 6m SMARTCOLORS PN-20 SDR-9", label: "315mm x 6m SMARTCOLORS PN-20 SDR-9" },
    { value: "315mm x 12m SMARTCOLORS PN-20 SDR-9", label: "315mm x 12m SMARTCOLORS PN-20 SDR-9" },
    { value: "63mm x 6m SMART PIPE/PP-RCT PN-16 S-3,2", label: "63mm x 6m SMART PIPE/PP-RCT PN-16 S-3,2" },
    { value: "63mm x 6m SMARTCOLORS PN-6 SDR-27,6", label: "63mm x 6m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "63mm x 12m SMARTCOLORS PN-6 SDR-27,6", label: "63mm x 12m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "63mm x 50m SMARTCOLORS PN-6 SDR-27,6", label: "63mm x 50m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "63mm x 100m SMARTCOLORS PN-6 SDR-27,6", label: "63mm x 100m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "63mm x 150m SMARTCOLORS PN-6 SDR-27,6", label: "63mm x 150m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "63mm x 200m SMARTCOLORS PN-6 SDR-27,6", label: "63mm x 200m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "63mm x 6m SMARTCOLORS PN-20 SDR-9", label: "63mm x 6m SMARTCOLORS PN-20 SDR-9" },
    { value: "63mm x 12m SMARTCOLORS PN-20 SDR-9", label: "63mm x 12m SMARTCOLORS PN-20 SDR-9" },
    { value: "63mm x 50m SMARTCOLORS PN-20 SDR-9", label: "63mm x 50m SMARTCOLORS PN-20 SDR-9" },
    { value: "63mm x 100m SMARTCOLORS PN-20 SDR-9", label: "63mm x 100m SMARTCOLORS PN-20 SDR-9" },
    { value: "63mm x 150m SMARTCOLORS PN-20 SDR-9", label: "63mm x 150m SMARTCOLORS PN-20 SDR-9" },
    { value: "63mm x 200m SMARTCOLORS PN-20 SDR-9", label: "63mm x 200m SMARTCOLORS PN-20 SDR-9" },
    { value: "63mm x 6m SMARTCOLORS PN-16 SDR-11", label: "63mm x 6m SMARTCOLORS PN-16 SDR-11" },
    { value: "63mm x 12m SMARTCOLORS PN-16 SDR-11", label: "63mm x 12m SMARTCOLORS PN-16 SDR-11" },
    { value: "63mm x 50m SMARTCOLORS PN-16 SDR-11", label: "63mm x 50m SMARTCOLORS PN-16 SDR-11" },
    { value: "63mm x 100m SMARTCOLORS PN-16 SDR-11", label: "63mm x 100m SMARTCOLORS PN-16 SDR-11" },
    { value: "63mm x 150m SMARTCOLORS PN-16 SDR-11", label: "63mm x 150m SMARTCOLORS PN-16 SDR-11" },
    { value: "63mm x 200m SMARTCOLORS PN-16 SDR-11", label: "63mm x 200m SMARTCOLORS PN-16 SDR-11" },
    { value: "63mm x 6m SMARTCOLORS PN-12,5 SDR-13,6", label: "63mm x 6m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "63mm x 12m SMARTCOLORS PN-12,5 SDR-13,6", label: "63mm x 12m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "63mm x 50m SMARTCOLORS PN-12,5 SDR-13,6", label: "63mm x 50m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "63mm x 100m SMARTCOLORS PN-12,5 SDR-13,6", label: "63mm x 100m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "63mm x 150m SMARTCOLORS PN-12,5 SDR-13,6", label: "63mm x 150m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "63mm x 200m SMARTCOLORS PN-12,5 SDR-13,6", label: "63mm x 200m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "63mm x 6m SMARTCOLORS PN-10 SDR-17", label: "63mm x 6m SMARTCOLORS PN-10 SDR-17" },
    { value: "63mm x 12m SMARTCOLORS PN-10 SDR-17", label: "63mm x 12m SMARTCOLORS PN-10 SDR-17" },
    { value: "63mm x 50m SMARTCOLORS PN-10 SDR-17", label: "63mm x 50m SMARTCOLORS PN-10 SDR-17" },
    { value: "63mm x 100m SMARTCOLORS PN-10 SDR-17", label: "63mm x 100m SMARTCOLORS PN-10 SDR-17" },
    { value: "63mm x 150m SMARTCOLORS PN-10 SDR-17", label: "63mm x 150m SMARTCOLORS PN-10 SDR-17" },
    { value: "63mm x 200m SMARTCOLORS PN-10 SDR-17", label: "63mm x 200m SMARTCOLORS PN-10 SDR-17" },
    { value: "50mm x 6m SMART PIPE/PP-RCT PN-16 S-3,2", label: "50mm x 6m SMART PIPE/PP-RCT PN-16 S-3,2" },
    { value: "50mm x 6m SMARTCOLORS PN-8 SDR-21", label: "50mm x 6m SMARTCOLORS PN-8 SDR-21" },
    { value: "50mm x 12m SMARTCOLORS PN-8 SDR-21", label: "50mm x 12m SMARTCOLORS PN-8 SDR-21" },
    { value: "50mm x 50m SMARTCOLORS PN-8 SDR-21", label: "50mm x 50m SMARTCOLORS PN-8 SDR-21" },
    { value: "50mm x 100m SMARTCOLORS PN-8 SDR-21", label: "50mm x 100m SMARTCOLORS PN-8 SDR-21" },
    { value: "50mm x 150m SMARTCOLORS PN-8 SDR-21", label: "50mm x 150m SMARTCOLORS PN-8 SDR-21" },
    { value: "50mm x 200m SMARTCOLORS PN-8 SDR-21", label: "50mm x 200m SMARTCOLORS PN-8 SDR-21" },
    { value: "50mm x 6m SMARTCOLORS PN-16 SDR-11", label: "50mm x 6m SMARTCOLORS PN-16 SDR-11" },
    { value: "50mm x 12m SMARTCOLORS PN-16 SDR-11", label: "50mm x 12m SMARTCOLORS PN-16 SDR-11" },
    { value: "50mm x 50m SMARTCOLORS PN-16 SDR-11", label: "50mm x 50m SMARTCOLORS PN-16 SDR-11" },
    { value: "50mm x 100m SMARTCOLORS PN-16 SDR-11", label: "50mm x 100m SMARTCOLORS PN-16 SDR-11" },
    { value: "50mm x 150m SMARTCOLORS PN-16 SDR-11", label: "50mm x 150m SMARTCOLORS PN-16 SDR-11" },
    { value: "50mm x 200m SMARTCOLORS PN-16 SDR-11", label: "50mm x 200m SMARTCOLORS PN-16 SDR-11" },
    { value: "50mm x 6m SMARTCOLORS PN-12,5 SDR-13,6", label: "50mm x 6m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "50mm x 12m SMARTCOLORS PN-12,5 SDR-13,6", label: "50mm x 12m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "50mm x 50m SMARTCOLORS PN-12,5 SDR-13,6", label: "50mm x 50m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "50mm x 100m SMARTCOLORS PN-12,5 SDR-13,6", label: "50mm x 100m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "50mm x 150m SMARTCOLORS PN-12,5 SDR-13,6", label: "50mm x 150m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "50mm x 200m SMARTCOLORS PN-12,5 SDR-13,6", label: "50mm x 200m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "50mm x 6m SMARTCOLORS PN-10 SDR-17", label: "50mm x 6m SMARTCOLORS PN-10 SDR-17" },
    { value: "50mm x 12m SMARTCOLORS PN-10 SDR-17", label: "50mm x 12m SMARTCOLORS PN-10 SDR-17" },
    { value: "50mm x 50m SMARTCOLORS PN-10 SDR-17", label: "50mm x 50m SMARTCOLORS PN-10 SDR-17" },
    { value: "50mm x 100m SMARTCOLORS PN-10 SDR-17", label: "50mm x 100m SMARTCOLORS PN-10 SDR-17" },
    { value: "50mm x 150m SMARTCOLORS PN-10 SDR-17", label: "50mm x 150m SMARTCOLORS PN-10 SDR-17" },
    { value: "50mm x 200m SMARTCOLORS PN-10 SDR-17", label: "50mm x 200m SMARTCOLORS PN-10 SDR-17" },
    { value: "450mm x 6m SMARTCOLORS PN-16 SDR-11", label: "450mm x 6m SMARTCOLORS PN-16 SDR-11" },
    { value: "450mm x 12m SMARTCOLORS PN-16 SDR-11", label: "450mm x 12m SMARTCOLORS PN-16 SDR-11" },
    { value: "450mm x 6m SMARTCOLORS PN-12,5 SDR-13,6", label: "450mm x 6m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "450mm x 12m SMARTCOLORS PN-12,5 SDR-13,6", label: "450mm x 12m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "450mm x 6m SMARTCOLORS PN-10 SDR-17", label: "450mm x 6m SMARTCOLORS PN-10 SDR-17" },
    { value: "450mm x 12m SMARTCOLORS PN-10 SDR-17", label: "450mm x 12m SMARTCOLORS PN-10 SDR-17" },
    { value: "450mm x 6m SMARTCOLORS PN-6 SDR-27,6", label: "450mm x 6m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "450mm x 12m SMARTCOLORS PN-6 SDR-27,6", label: "450mm x 12m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "40mm x 6m SMART PIPE/PP-RCT PN-16 S-3,2", label: "40mm x 6m SMART PIPE/PP-RCT PN-16 S-3,2" },
    { value: "40mm x 6m SMARTCOLORS PN-20 SDR-9", label: "40mm x 6m SMARTCOLORS PN-20 SDR-9" },
    { value: "40mm x 12m SMARTCOLORS PN-20 SDR-9", label: "40mm x 12m SMARTCOLORS PN-20 SDR-9" },
    { value: "40mm x 50m SMARTCOLORS PN-20 SDR-9", label: "40mm x 50m SMARTCOLORS PN-20 SDR-9" },
    { value: "40mm x 100m SMARTCOLORS PN-20 SDR-9", label: "40mm x 100m SMARTCOLORS PN-20 SDR-9" },
    { value: "40mm x 150m SMARTCOLORS PN-20 SDR-9", label: "40mm x 150m SMARTCOLORS PN-20 SDR-9" },
    { value: "40mm x 200m SMARTCOLORS PN-20 SDR-9", label: "40mm x 200m SMARTCOLORS PN-20 SDR-9" },
    { value: "40mm x 6m SMARTCOLORS PN-16 SDR-11", label: "40mm x 6m SMARTCOLORS PN-16 SDR-11" },
    { value: "40mm x 12m SMARTCOLORS PN-16 SDR-11", label: "40mm x 12m SMARTCOLORS PN-16 SDR-11" },
    { value: "40mm x 50m SMARTCOLORS PN-16 SDR-11", label: "40mm x 50m SMARTCOLORS PN-16 SDR-11" },
    { value: "40mm x 100m SMARTCOLORS PN-16 SDR-11", label: "40mm x 100m SMARTCOLORS PN-16 SDR-11" },
    { value: "40mm x 150m SMARTCOLORS PN-16 SDR-11", label: "40mm x 150m SMARTCOLORS PN-16 SDR-11" },
    { value: "40mm x 200m SMARTCOLORS PN-16 SDR-11", label: "40mm x 200m SMARTCOLORS PN-16 SDR-11" },
    { value: "40mm x 6m SMARTCOLORS PN-12,5 SDR-13,6", label: "40mm x 6m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "40mm x 12m SMARTCOLORS PN-12,5 SDR-13,6", label: "40mm x 12m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "40mm x 50m SMARTCOLORS PN-12,5 SDR-13,6", label: "40mm x 50m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "40mm x 100m SMARTCOLORS PN-12,5 SDR-13,6", label: "40mm x 100m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "40mm x 150m SMARTCOLORS PN-12,5 SDR-13,6", label: "40mm x 150m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "40mm x 200m SMARTCOLORS PN-12,5 SDR-13,6", label: "40mm x 200m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "40mm x 6m SMARTCOLORS PN-10 SDR-17", label: "40mm x 6m SMARTCOLORS PN-10 SDR-17" },
    { value: "40mm x 12m SMARTCOLORS PN-10 SDR-17", label: "40mm x 12m SMARTCOLORS PN-10 SDR-17" },
    { value: "40mm x 50m SMARTCOLORS PN-10 SDR-17", label: "40mm x 50m SMARTCOLORS PN-10 SDR-17" },
    { value: "40mm x 100m SMARTCOLORS PN-10 SDR-17", label: "40mm x 100m SMARTCOLORS PN-10 SDR-17" },
    { value: "40mm x 150m SMARTCOLORS PN-10 SDR-17", label: "40mm x 150m SMARTCOLORS PN-10 SDR-17" },
    { value: "40mm x 200m SMARTCOLORS PN-10 SDR-17", label: "40mm x 200m SMARTCOLORS PN-10 SDR-17" },
    { value: "400mm x 6m SMARTCOLORS PN-16 SDR-11", label: "400mm x 6m SMARTCOLORS PN-16 SDR-11" },
    { value: "400mm x 12m SMARTCOLORS PN-16 SDR-11", label: "400mm x 12m SMARTCOLORS PN-16 SDR-11" },
    { value: "400mm x 6m SMARTCOLORS PN-12,5 SDR-13,6", label: "400mm x 6m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "400mm x 12m SMARTCOLORS PN-12,5 SDR-13,6", label: "400mm x 12m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "400mm x 6m SMARTCOLORS PN-10 SDR-17", label: "400mm x 6m SMARTCOLORS PN-10 SDR-17" },
    { value: "400mm x 12m SMARTCOLORS PN-10 SDR-17", label: "400mm x 12m SMARTCOLORS PN-10 SDR-17" },
    { value: "400mm x 6m SMARTCOLORS PN-6 SDR-27,6", label: "400mm x 6m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "400mm x 12m SMARTCOLORS PN-6 SDR-27,6", label: "400mm x 12m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "355mm x 6m SMARTCOLORS PN-16 SDR-11", label: "355mm x 6m SMARTCOLORS PN-16 SDR-11" },
    { value: "355mm x 6m SMARTCOLORS PN-20 SDR-9", label: "355mm x 6m SMARTCOLORS PN-20 SDR-9" },
    { value: "355mm x 6m SMARTCOLORS PN-6 SDR-27,6", label: "355mm x 6m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "355mm x 12m SMARTCOLORS PN-6 SDR-27,6", label: "355mm x 12m SMARTCOLORS PN-6 SDR-27,6" },
    { value: "355mm x 12m HDPE PN-16 SDR-11", label: "355mm x 12m HDPE PN-16 SDR-11" },
    { value: "355mm x 6m HDPE PN-12,5 SDR-13,6", label: "355mm x 6m HDPE PN-12,5 SDR-13,6" },
    { value: "355mm x 12m HDPE PN-12,5 SDR-13,6", label: "355mm x 12m HDPE PN-12,5 SDR-13,6" },
    { value: "355mm x 6m HDPE PN-10 SDR-17", label: "355mm x 6m HDPE PN-10 SDR-17" },
    { value: "355mm x 12m HDPE PN-10 SDR-17", label: "355mm x 12m HDPE PN-10 SDR-17" },
    { value: "32mm x 6m HDPE PN-20 SDR-9", label: "32mm x 6m HDPE PN-20 SDR-9" },
    { value: "32mm x 12m HDPE PN-20 SDR-9", label: "32mm x 12m HDPE PN-20 SDR-9" },
    { value: "32mm x 50m HDPE PN-20 SDR-9", label: "32mm x 50m HDPE PN-20 SDR-9" },
    { value: "32mm x 100m HDPE PN-20 SDR-9", label: "32mm x 100m HDPE PN-20 SDR-9" },
    { value: "32mm x 150m HDPE PN-20 SDR-9", label: "32mm x 150m HDPE PN-20 SDR-9" },
    { value: "32mm x 200m HDPE PN-20 SDR-9", label: "32mm x 200m HDPE PN-20 SDR-9" },
    { value: "32mm x 6m HDPE PN-16 SDR-11", label: "32mm x 6m HDPE PN-16 SDR-11" },
    { value: "32mm x 12m HDPE PN-16 SDR-11", label: "32mm x 12m HDPE PN-16 SDR-11" },
    { value: "32mm x 50m HDPE PN-16 SDR-11", label: "32mm x 50m HDPE PN-16 SDR-11" },
    { value: "32mm x 100m HDPE PN-16 SDR-11", label: "32mm x 100m HDPE PN-16 SDR-11" },
    { value: "32mm x 150m HDPE PN-16 SDR-11", label: "32mm x 150m HDPE PN-16 SDR-11" },
    { value: "32mm x 200m HDPE PN-16 SDR-11", label: "32mm x 200m HDPE PN-16 SDR-11" },
    { value: "32mm x 6m HDPE PN-12,5 SDR-13,6", label: "32mm x 6m HDPE PN-12,5 SDR-13,6" },
    { value: "32mm x 12m HDPE PN-12,5 SDR-13,6", label: "32mm x 12m HDPE PN-12,5 SDR-13,6" },
    { value: "32mm x 50m HDPE PN-12,5 SDR-13,6", label: "32mm x 50m HDPE PN-12,5 SDR-13,6" },
    { value: "32mm x 100m HDPE PN-12,5 SDR-13,6", label: "32mm x 100m HDPE PN-12,5 SDR-13,6" },
    { value: "32mm x 150m HDPE PN-12,5 SDR-13,6", label: "32mm x 150m HDPE PN-12,5 SDR-13,6" },
    { value: "32mm x 200m HDPE PN-12,5 SDR-13,6", label: "32mm x 200m HDPE PN-12,5 SDR-13,6" },
    { value: "32mm x 6m HDPE PN-10 SDR-17", label: "32mm x 6m HDPE PN-10 SDR-17" },
    { value: "32mm x 12m HDPE PN-10 SDR-17", label: "32mm x 12m HDPE PN-10 SDR-17" },
    { value: "32mm x 50m HDPE PN-10 SDR-17", label: "32mm x 50m HDPE PN-10 SDR-17" },
    { value: "32mm x 100m HDPE PN-10 SDR-17", label: "32mm x 100m HDPE PN-10 SDR-17" },
    { value: "32mm x 150m HDPE PN-10 SDR-17", label: "32mm x 150m HDPE PN-10 SDR-17" },
    { value: "32mm x 200m HDPE PN-10 SDR-17", label: "32mm x 200m HDPE PN-10 SDR-17" },
    { value: "32mm x 100m HDPE PN-6 SDR-27,6", label: "32mm x 100m HDPE PN-6 SDR-27,6" },
    { value: "32mm x 200m HDPE PN-6 SDR-27,6", label: "32mm x 200m HDPE PN-6 SDR-27,6" },
    { value: "315mm x 6m HDPE PN-6 SDR-27,6", label: "315mm x 6m HDPE PN-6 SDR-27,6" },
    { value: "315mm x 12m HDPE PN-6 SDR-27,6", label: "315mm x 12m HDPE PN-6 SDR-27,6" },
    { value: "315mm x 6m HDPE PN-16 SDR-11", label: "315mm x 6m HDPE PN-16 SDR-11" },
    { value: "315mm x 12m HDPE PN-16 SDR-11", label: "315mm x 12m HDPE PN-16 SDR-11" },
    { value: "315mm x 6m HDPE PN-12,5 SDR-13,6", label: "315mm x 6m HDPE PN-12,5 SDR-13,6" },
    { value: "315mm x 12m HDPE PN-12,5 SDR-13,6", label: "315mm x 12m HDPE PN-12,5 SDR-13,6" },
    { value: "315mm x 3m HDPE PN-10 SDR-17", label: "315mm x 3m HDPE PN-10 SDR-17" },
    { value: "315mm x 6m HDPE PN-10 SDR-17", label: "315mm x 6m HDPE PN-10 SDR-17" },
    { value: "315mm x 12m HDPE PN-10 SDR-17", label: "315mm x 12m HDPE PN-10 SDR-17" },
    { value: "280mm x 6m HDPE PN-16 SDR-11", label: "280mm x 6m HDPE PN-16 SDR-11" },
    { value: "280mm x 12m HDPE PN-16 SDR-11", label: "280mm x 12m HDPE PN-16 SDR-11" },
    { value: "280mm x 6m HDPE PN-12,5 SDR-13,6", label: "280mm x 6m HDPE PN-12,5 SDR-13,6" },
    { value: "280mm x 12m HDPE PN-12,5 SDR-13,6", label: "280mm x 12m HDPE PN-12,5 SDR-13,6" },
    { value: "280mm x 6m HDPE PN-6 SDR-27,6", label: "280mm x 6m HDPE PN-6 SDR-27,6" },
    { value: "280mm x 12m HDPE PN-6 SDR-27,6", label: "280mm x 12m HDPE PN-6 SDR-27,6" },
    { value: "280mm x 6m HDPE PN-10 SDR-17", label: "280mm x 6m HDPE PN-10 SDR-17" },
    { value: "280mm x 12m HDPE PN-10 SDR-17", label: "280mm x 12m HDPE PN-10 SDR-17" },
    { value: "25mm x 6m HDPE PN-12,5 SDR-13,6", label: "25mm x 6m HDPE PN-12,5 SDR-13,6" },
    { value: "25mm x 12m HDPE PN-12,5 SDR-13,6", label: "25mm x 12m HDPE PN-12,5 SDR-13,6" },
    { value: "25mm x 50m HDPE PN-12,5 SDR-13,6", label: "25mm x 50m HDPE PN-12,5 SDR-13,6" },
    { value: "25mm x 100m HDPE PN-12,5 SDR-13,6", label: "25mm x 100m HDPE PN-12,5 SDR-13,6" },
    { value: "25mm x 150m HDPE PN-12,5 SDR-13,6", label: "25mm x 150m HDPE PN-12,5 SDR-13,6" },
    { value: "25mm x 200m HDPE PN-12,5 SDR-13,6", label: "25mm x 200m HDPE PN-12,5 SDR-13,6" },
    { value: "25mm x 6m HDPE PN-16 SDR-11", label: "25mm x 6m HDPE PN-16 SDR-11" },
    { value: "25mm x 12m HDPE PN-16 SDR-11", label: "25mm x 12m HDPE PN-16 SDR-11" },
    { value: "25mm x 50m HDPE PN-16 SDR-11", label: "25mm x 50m HDPE PN-16 SDR-11" },
    { value: "25mm x 100m HDPE PN-16 SDR-11", label: "25mm x 100m HDPE PN-16 SDR-11" },
    { value: "25mm x 150m HDPE PN-16 SDR-11", label: "25mm x 150m HDPE PN-16 SDR-11" },
    { value: "25mm x 200m HDPE PN-16 SDR-11", label: "25mm x 200m HDPE PN-16 SDR-11" },
    { value: "250mm x 6m HDPE PN-6 SDR-27,6", label: "250mm x 6m HDPE PN-6 SDR-27,6" },
    { value: "250mm x 12m HDPE PN-6 SDR-27,6", label: "250mm x 12m HDPE PN-6 SDR-27,6" },
    { value: "250mm x 6m HDPE PN-20 SDR-9", label: "250mm x 6m HDPE PN-20 SDR-9" },
    { value: "250mm x 12m HDPE PN-20 SDR-9", label: "250mm x 12m HDPE PN-20 SDR-9" },
    { value: "250mm x 6m HDPE PN-16 SDR-11", label: "250mm x 6m HDPE PN-16 SDR-11" },
    { value: "250mm x 12m HDPE PN-16 SDR-11", label: "250mm x 12m HDPE PN-16 SDR-11" },
    { value: "250mm x 6m HDPE PN-12,5 SDR-13,6", label: "250mm x 6m HDPE PN-12,5 SDR-13,6" },
    { value: "250mm x 12m HDPE PN-12,5 SDR-13,6", label: "250mm x 12m HDPE PN-12,5 SDR-13,6" },
    { value: "250mm x 6m HDPE PN-10 SDR-17", label: "250mm x 6m HDPE PN-10 SDR-17" },
    { value: "250mm x 12m HDPE PN-10 SDR-17", label: "250mm x 12m HDPE PN-10 SDR-17" },
    { value: "225mm x 6m HDPE PN-20 SDR-11", label: "225mm x 6m HDPE PN-20 SDR-11" },
    { value: "225mm x 6m HDPE PN-16 SDR-11", label: "225mm x 6m HDPE PN-16 SDR-11" },
    { value: "225mm x 12m HDPE PN-16 SDR-11", label: "225mm x 12m HDPE PN-16 SDR-11" },
    { value: "225mm x 6m HDPE PN-12,5 SDR-13,6", label: "225mm x 6m HDPE PN-12,5 SDR-13,6" },
    { value: "225mm x 12m HDPE PN-12,5 SDR-13,6", label: "225mm x 12m HDPE PN-12,5 SDR-13,6" },
    { value: "225mm x 6m HDPE PN-6 SDR-17", label: "225mm x 6m HDPE PN-6 SDR-17" },
    { value: "225mm x 6m HDPE PN-10 SDR-17", label: "225mm x 6m HDPE PN-10 SDR-17" },
    { value: "225mm x 12m HDPE PN-10 SDR-17", label: "225mm x 12m HDPE PN-10 SDR-17" },
    { value: "225mm x 6m HDPE PN-6 SDR-27,6", label: "225mm x 6m HDPE PN-6 SDR-27,6" },
    { value: "225mm x 12m HDPE PN-6 SDR-27,6", label: "225mm x 12m HDPE PN-6 SDR-27,6" },
    { value: "20mm x 6m HDPE PN-16 SDR-11", label: "20mm x 6m HDPE PN-16 SDR-11" },
    { value: "20mm x 12m HDPE PN-16 SDR-11", label: "20mm x 12m HDPE PN-16 SDR-11" },
    { value: "20mm x 50m HDPE PN-16 SDR-11", label: "20mm x 50m HDPE PN-16 SDR-11" },
    { value: "20mm x 100m HDPE PN-16 SDR-11", label: "20mm x 100m HDPE PN-16 SDR-11" },
    { value: "20mm x 150m HDPE PN-16 SDR-11", label: "20mm x 150m HDPE PN-16 SDR-11" },
    { value: "20mm x 200m HDPE PN-16 SDR-11", label: "20mm x 200m HDPE PN-16 SDR-11" },
    { value: "200mm x 6m HDPE PN-6 SDR-27,6", label: "200mm x 6m HDPE PN-6 SDR-27,6" },
    { value: "200mm x 12m HDPE PN-6 SDR-27,6", label: "200mm x 12m HDPE PN-6 SDR-27,6" },
    { value: "200mm x 6m HDPE PN-20 SDR-9", label: "200mm x 6m HDPE PN-20 SDR-9" },
    { value: "200mm x 12m HDPE PN-20 SDR-9", label: "200mm x 12m HDPE PN-20 SDR-9" },
    { value: "200mm x 6m HDPE PN-16 SDR-11", label: "200mm x 6m HDPE PN-16 SDR-11" },
    { value: "200mm x 12m HDPE PN-16 SDR-11", label: "200mm x 12m HDPE PN-16 SDR-11" },
    { value: "200mm x 6m HDPE PN-12,5 SDR-13,6", label: "200mm x 6m HDPE PN-12,5 SDR-13,6" },
    { value: "200mm x 12m HDPE PN-12,5 SDR-13,6", label: "200mm x 12m HDPE PN-12,5 SDR-13,6" },
    { value: "200mm x 6m HDPE PN-10 SDR-17", label: "200mm x 6m HDPE PN-10 SDR-17" },
    { value: "200mm x 3m HDPE PN-10 SDR-17", label: "200mm x 3m HDPE PN-10 SDR-17" },
    { value: "200mm x 12m HDPE PN-10 SDR-17", label: "200mm x 12m HDPE PN-10 SDR-17" },
    { value: "180mm x 6m HDPE PN-6 SDR-27,6", label: "180mm x 6m HDPE PN-6 SDR-27,6" },
    { value: "180mm x 12m HDPE PN-6 SDR-27,6", label: "180mm x 12m HDPE PN-6 SDR-27,6" },
    { value: "180mm x 6m HDPE PN-16 SDR-11", label: "180mm x 6m HDPE PN-16 SDR-11" },
    { value: "180mm x 12m HDPE PN-16 SDR-11", label: "180mm x 12m HDPE PN-16 SDR-11" },
    { value: "180mm x 6m HDPE PN-12,5 SDR-13,6", label: "180mm x 6m HDPE PN-12,5 SDR-13,6" },
    { value: "180mm x 12m HDPE PN-12,5 SDR-13,6", label: "180mm x 12m HDPE PN-12,5 SDR-13,6" },
    { value: "180mm x 6m HDPE PN-10 SDR-17", label: "180mm x 6m HDPE PN-10 SDR-17" },
    { value: "180mm x 12m HDPE PN-10 SDR-17", label: "180mm x 12m HDPE PN-10 SDR-17" },
    { value: "160mm x 6m HDPE PN-6 SDR-27,6", label: "160mm x 6m HDPE PN-6 SDR-27,6" },
    { value: "160mm x 12m HDPE PN-6 SDR-27,6", label: "160mm x 12m HDPE PN-6 SDR-27,6" },
    { value: "160mm x 6m HDPE PN-20 SDR-9", label: "160mm x 6m HDPE PN-20 SDR-9" },
    { value: "160mm x 12m HDPE PN-20 SDR-9", label: "160mm x 12m HDPE PN-20 SDR-9" },
    { value: "160mm x 6m HDPE PN-16 SDR-11", label: "160mm x 6m HDPE PN-16 SDR-11" },
    { value: "160mm x 12m HDPE PN-16 SDR-11", label: "160mm x 12m HDPE PN-16 SDR-11" },
    { value: "160mm x 6m HDPE PN-12,5 SDR-13,6", label: "160mm x 6m HDPE PN-12,5 SDR-13,6" },
    { value: "160mm x 12m HDPE PN-12,5 SDR-13,6", label: "160mm x 12m HDPE PN-12,5 SDR-13,6" },
    { value: "160mm x 6m HDPE PN-10 SDR-17", label: "160mm x 6m HDPE PN-10 SDR-17" },
    { value: "160mm x 12m HDPE PN-10 SDR-17", label: "160mm x 12m HDPE PN-10 SDR-17" },
    { value: "140mm x 6m HDPE PN-16 SDR-11", label: "140mm x 6m HDPE PN-16 SDR-11" },
    { value: "140mm x 12m HDPE PN-16 SDR-11", label: "140mm x 12m HDPE PN-16 SDR-11" },
    { value: "140mm x 6m HDPE PN-12,5 SDR-13,6", label: "140mm x 6m HDPE PN-12,5 SDR-13,6" },
    { value: "140mm x 12m HDPE PN-12,5 SDR-13,6", label: "140mm x 12m HDPE PN-12,5 SDR-13,6" },
    { value: "140mm x 6m HDPE PN-10 SDR-17", label: "140mm x 6m HDPE PN-10 SDR-17" },
    { value: "140mm x 12m HDPE PN-10 SDR-17", label: "140mm x 12m HDPE PN-10 SDR-17" },
    { value: "140mm x 6m HDPE PN-6 SDR-27,6", label: "140mm x 6m HDPE PN-6 SDR-27,6" },
    { value: "140mm x 12m HDPE PN-6 SDR-27,6", label: "140mm x 12m HDPE PN-6 SDR-27,6" },
    { value: "125mm x 6m HDPE PN-6 SDR-27,6", label: "125mm x 6m HDPE PN-6 SDR-27,6" },
    { value: "125mm x 12m HDPE PN-6 SDR-27,6", label: "125mm x 12m HDPE PN-6 SDR-27,6" },
    { value: "125mm x 6m HDPE PN-20 SDR-9", label: "125mm x 6m HDPE PN-20 SDR-9" },
    { value: "125mm x 12m HDPE PN-20 SDR-9", label: "125mm x 12m HDPE PN-20 SDR-9" },
    { value: "125mm x 6m HDPE PN-16 SDR-11", label: "125mm x 6m HDPE PN-16 SDR-11" },
    { value: "125mm x 12m HDPE PN-16 SDR-11", label: "125mm x 12m HDPE PN-16 SDR-11" },
    { value: "125mm x 6m HDPE PN-12,5 SDR-13,6", label: "125mm x 6m HDPE PN-12,5 SDR-13,6" },
    { value: "125mm x 12m HDPE PN-12,5 SDR-13,6", label: "125mm x 12m HDPE PN-12,5 SDR-13,6" },
    { value: "125mm x 6m HDPE PN-10 SDR-17", label: "125mm x 6m HDPE PN-10 SDR-17" },
    { value: "125mm x 12m HDPE PN-10 SDR-17", label: "125mm x 12m HDPE PN-10 SDR-17" },
    { value: "110mm x 6m HDPE PN-6 SDR-27,6", label: "110mm x 6m HDPE PN-6 SDR-27,6" },
    { value: "110mm x 12m HDPE PN-6 SDR-27,6", label: "110mm x 12m HDPE PN-6 SDR-27,6" },
    { value: "110mm x 50m HDPE PN-6 SDR-27,6", label: "110mm x 50m HDPE PN-6 SDR-27,6" },
    { value: "110mm x 100m HDPE PN-6 SDR-27,6", label: "110mm x 100m HDPE PN-6 SDR-27,6" },
    { value: "110mm x 150m HDPE PN-6 SDR-27,6", label: "110mm x 150m HDPE PN-6 SDR-27,6" },
    { value: "110mm x 200m HDPE PN-6 SDR-27,6", label: "110mm x 200m HDPE PN-6 SDR-27,6" },
    { value: "110mm x 6m HDPE PN-20 SDR-9", label: "110mm x 6m HDPE PN-20 SDR-9" },
    { value: "110mm x 12m HDPE PN-20 SDR-9", label: "110mm x 12m HDPE PN-20 SDR-9" },
    { value: "110mm x 50m HDPE PN-20 SDR-9", label: "110mm x 50m HDPE PN-20 SDR-9" },
    { value: "110mm x 100m HDPE PN-20 SDR-9", label: "110mm x 100m HDPE PN-20 SDR-9" },
    { value: "110mm x 150m HDPE PN-20 SDR-9", label: "110mm x 150m HDPE PN-20 SDR-9" },
    { value: "110mm x 200m HDPE PN-20 SDR-9", label: "110mm x 200m HDPE PN-20 SDR-9" },
    { value: "110mm x 6m HDPE PN-16 SDR-11", label: "110mm x 6m HDPE PN-16 SDR-11" },
    { value: "110mm x 12m HDPE PN-16 SDR-11", label: "110mm x 12m HDPE PN-16 SDR-11" },
    { value: "110mm x 50m HDPE PN-16 SDR-11", label: "110mm x 50m HDPE PN-16 SDR-11" },
    { value: "110mm x 100m HDPE PN-16 SDR-11", label: "110mm x 100m HDPE PN-16 SDR-11" },
    { value: "110mm x 150m HDPE PN-16 SDR-11", label: "110mm x 150m HDPE PN-16 SDR-11" },
    { value: "110mm x 200m HDPE PN-16 SDR-11", label: "110mm x 200m HDPE PN-16 SDR-11" },
    { value: "110mm x 6m HDPE PN-12,5 SDR-13,6", label: "110mm x 6m HDPE PN-12,5 SDR-13,6" },
    { value: "110mm x 12m HDPE PN-12,5 SDR-13,6", label: "110mm x 12m HDPE PN-12,5 SDR-13,6" },
    { value: "110mm x 50m HDPE PN-12,5 SDR-13,6", label: "110mm x 50m HDPE PN-12,5 SDR-13,6" },
    { value: "110mm x 100m HDPE PN-12,5 SDR-13,6", label: "110mm x 100m HDPE PN-12,5 SDR-13,6" },
    { value: "110mm x 150m HDPE PN-12,5 SDR-13,6", label: "110mm x 150m HDPE PN-12,5 SDR-13,6" },
    { value: "110mm x 200m HDPE PN-12,5 SDR-13,6", label: "110mm x 200m HDPE PN-12,5 SDR-13,6" },
    { value: "110mm x 6m HDPE PN-10 SDR-17", label: "110mm x 6m HDPE PN-10 SDR-17" },
    { value: "110mm x 12m HDPE PN-10 SDR-17", label: "110mm x 12m HDPE PN-10 SDR-17" },
    { value: "110mm x 50m HDPE PN-10 SDR-17", label: "110mm x 50m HDPE PN-10 SDR-17" },
    { value: "110mm x 100m HDPE PN-10 SDR-17", label: "110mm x 100m HDPE PN-10 SDR-17" },
    { value: "110mm x 150m HDPE PN-10 SDR-17", label: "110mm x 150m HDPE PN-10 SDR-17" },
    { value: "110mm x 200m HDPE PN-10 SDR-17", label: "110mm x 200m HDPE PN-10 SDR-17" },
];


interface PhiDialogsProps {
    isNewEnsayoOpen: boolean;
    setIsNewEnsayoOpen: (isOpen: boolean) => void;
    isResultOpen: boolean;
    setIsResultOpen: (isOpen: boolean) => void;
    addEnsayo: (ensayo: Omit<EnsayoPHI, 'id'>) => Promise<void>;
    updateEnsayo: (id: string, updatedData: Partial<EnsayoPHI>) => Promise<void>;
    ensayosActivos: EnsayoPHI[];
}

export function PhiDialogs({ isNewEnsayoOpen, setIsNewEnsayoOpen, isResultOpen, setIsResultOpen, addEnsayo, updateEnsayo, ensayosActivos }: PhiDialogsProps) {
    const { toast } = useToast();
    const newEnsayoForm = useForm();
    const resultForm = useForm();

    const onNewEnsayoSubmit = async (data: any) => {
        const newEnsayo: Omit<EnsayoPHI, 'id'> = {
            fechaIngresoManual: data.fechaIngreso,
            fechaInicio: new Date().toISOString(),
            producto: data.producto,
            raya: data.raya,
            horas: Number(data.horas),
            estado: 'EN PROCESO',
        };
        await addEnsayo(newEnsayo);
        toast({ title: 'Ensayo Iniciado', description: `El ensayo para ${data.producto} ha comenzado.` });
        setIsNewEnsayoOpen(false);
        newEnsayoForm.reset();
    };

    const onResultSubmit = async (data: any) => {
        const { ensayoId, presion, falla, observacion } = data;
        if (!ensayoId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Debe seleccionar un ensayo en proceso.' });
            return;
        }
        
        const resultado = falla
            ? `Con fallas a ${presion} bar: ${observacion}`
            : `Sin fallas a ${presion} [bar]`;

        await updateEnsayo(ensayoId, { resultado, estado: 'FINALIZADO' });
        toast({ title: 'Resultado Registrado', description: `El resultado para el ensayo ${ensayoId} ha sido guardado.` });
        setIsResultOpen(false);
        resultForm.reset();
    };
    
    const rayaOptions = ["Blanca", "Roja", "Verde", "Azul"];

    return (
        <>
            <Dialog open={isNewEnsayoOpen} onOpenChange={setIsNewEnsayoOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Iniciar Nuevo Ensayo PHI</DialogTitle>
                        <DialogDescription>Complete los datos para comenzar un nuevo seguimiento.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={newEnsayoForm.handleSubmit(onNewEnsayoSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                            <Input id="fechaIngreso" type="date" {...newEnsayoForm.register('fechaIngreso', { required: true })} defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="producto">Producto</Label>
                            <Combobox options={productosPHI} {...newEnsayoForm.register('producto', { required: true })}
                                value={newEnsayoForm.watch('producto')}
                                onChange={(value) => newEnsayoForm.setValue('producto', value)}
                                placeholder="Seleccione un producto..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="raya">Color de Raya</Label>
                            <select id="raya" {...newEnsayoForm.register('raya', { required: true })} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                {rayaOptions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="horas">Horas de Ensayo</Label>
                            <Input id="horas" type="number" {...newEnsayoForm.register('horas', { required: true, valueAsNumber: true })} />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Iniciar Ensayo</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar Resultado de Ensayo</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={resultForm.handleSubmit(onResultSubmit)} className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="ensayoId">Ensayo en Proceso (Fila)</Label>
                            <select id="ensayoId" {...resultForm.register('ensayoId', { required: true })} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="">Seleccione una fila...</option>
                                {ensayosActivos.map((e, index) => <option key={e.id} value={e.id}>Fila {15 + index} - {e.producto}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="presion">Presión [bar]</Label>
                            <Input id="presion" type="number" {...resultForm.register('presion', { required: true, valueAsNumber: true })} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="falla" {...resultForm.register('falla')} />
                            <Label htmlFor="falla">Hubo fallas en el ensayo</Label>
                        </div>
                        {resultForm.watch('falla') && (
                            <div className="space-y-2">
                                <Label htmlFor="observacion">Observación de la Falla</Label>
                                <Textarea id="observacion" {...resultForm.register('observacion')} />
                            </div>
                        )}
                        <DialogFooter>
                            <Button type="submit">Registrar Resultado</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

