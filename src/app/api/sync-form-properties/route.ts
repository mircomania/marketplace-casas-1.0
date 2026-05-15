import { NextResponse } from 'next/server';

import base from '@/lib/airtable';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    // buscar propiedades pendientes creadas desde formulario
    const { data: properties, error } = await supabaseAdmin.from('properties').select('*').eq('source', 'form').is('airtable_form_record_id', null);

    if (error) {
      console.error(error);

      return NextResponse.json({ error: 'Error obteniendo propiedades' }, { status: 500 });
    }

    for (const property of properties) {
      // crear registro en airtable
      const createdRecord = await base(process.env.AIRTABLE_TABLE_FORM!).create({
        name: property.title,
        price: property.price,
        public_id: property.public_id,
        slug: property.slug,
        status: property.status,
        source: property.source,
      });

      // guardar id airtable en supabase
      await supabaseAdmin
        .from('properties')
        .update({
          airtable_form_record_id: createdRecord.id,
        })
        .eq('id', property.id);
    }

    return NextResponse.json({
      success: true,
      synced: properties.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Error interno sync form' }, { status: 500 });
  }
}
