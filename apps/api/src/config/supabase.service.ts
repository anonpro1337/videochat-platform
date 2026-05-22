import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '@videochat/config';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  public admin: SupabaseClient;

  constructor() {
    this.admin = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    this.logger.log('Supabase admin client initialized');
  }
}
