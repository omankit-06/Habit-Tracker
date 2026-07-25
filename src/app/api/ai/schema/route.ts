import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { columns, rows } = body;

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Heuristic/Mock AI Schema Inference
    // In a real GCP environment, this would call Gemini API:
    // const prompt = `Analyze this spreadsheet grid: ${JSON.stringify(rows)}. Infer semantic column names and data types (text, checkbox, etc.) for these columns: ${JSON.stringify(columns)}.`
    
    const suggestedColumns = columns.map((col: { id: string; name: string }, index: number) => {
      let inferredType = 'text';
      let inferredName = col.name;

      // Extract all values for this column across all rows
      const values = rows.map((r: { values: Record<string, unknown> }) => r.values[col.id]).filter((v: unknown) => v !== undefined && v !== '');

      if (values.length > 0) {
        // If all values are boolean or 'yes'/'no' or 'true'/'false'
        const isCheckbox = values.every((v: unknown) => 
          typeof v === 'boolean' || 
          (typeof v === 'string' && ['yes', 'no', 'true', 'false', 'done', 'todo'].includes(v.toLowerCase()))
        );

        if (isCheckbox) {
          inferredType = 'checkbox';
          inferredName = 'Status / Done';
        } else {
          // Check if it looks like a time
          const isTime = values.every((v: unknown) => 
            typeof v === 'string' && /^\d{1,2}:\d{2}\s*(AM|PM)?$/i.test(v)
          );
          if (isTime) {
            inferredType = 'time';
            inferredName = 'Time';
          } else {
            // Check if it's repeating categorical strings
            const uniqueValues = new Set(values);
            if (uniqueValues.size <= 5 && values.length > 3) {
              inferredType = 'select';
              inferredName = 'Category';
            } else if (index === 0) {
              inferredName = 'Task / Routine';
            }
          }
        }
      } else if (index === 0) {
        inferredName = 'Task Name';
      } else if (index === 1) {
        inferredType = 'checkbox';
        inferredName = 'Completed';
      }

      return {
        id: col.id,
        name: inferredName,
        type: inferredType,
      };
    });

    return NextResponse.json({
      success: true,
      columns: suggestedColumns
    });

  } catch (error) {
    console.error('AI Schema Detection Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process spreadsheet data' },
      { status: 500 }
    );
  }
}
