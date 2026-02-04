-- Create scan_history table for storing crop disease analysis results
CREATE TABLE IF NOT EXISTS public.scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop TEXT NOT NULL,
  disease TEXT NOT NULL,
  confidence DECIMAL(5, 4) NOT NULL,
  is_healthy BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth required for this demo app)
CREATE POLICY "Allow public read access" ON public.scan_history
  FOR SELECT USING (true);

-- Allow public insert access (no auth required for this demo app)
CREATE POLICY "Allow public insert access" ON public.scan_history
  FOR INSERT WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON public.scan_history(created_at DESC);
