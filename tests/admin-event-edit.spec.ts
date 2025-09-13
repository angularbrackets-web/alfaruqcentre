import { test, expect } from '@playwright/test';
import path from 'path';

test('can upload poster on event edit (mocked upload)', async ({ page }) => {
  const eventId = 'test-event-1';

  // Mocked existing event returned by GET /api/events/:id
  const mockEvent = {
    success: true,
    data: {
      id: eventId,
      title: 'Mock Event',
      description: 'Mock desc',
      poster: 'https://res.cloudinary.com/demo/existing.jpg',
      video: null,
      thumbnail: null,
      registrationLink: '',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      expiryDate: new Date(Date.now() + 172800000).toISOString(),
      summary: ['point'],
      tags: [],
      status: 'active',
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  // Intercept upload and return a mocked Cloudinary URL
  await page.route('**/api/upload', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        url: 'https://res.cloudinary.com/demo/uploaded-poster.jpg',
        message: 'Image uploaded successfully'
      })
    });
  });

  // Mock auth verification to simulate an authenticated admin
  await page.route('**/api/auth/verify', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, isAuthenticated: true, message: 'Session valid' })
    });
  });

  // Capture PUT body for assertion and mock GET
  let capturedPutBody: string | null = null;
  await page.route('**/api/events/*', async route => {
    const req = route.request();
    if (req.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockEvent)
      });
      return;
    }
    if (req.method() === 'PUT') {
      capturedPutBody = req.postData();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockEvent.data,
          message: 'Event updated successfully'
        })
      });
      return;
    }
    return route.continue();
  });

  // Navigate to the edit page (dev server must be running)
  const base = process.env.TEST_BASE || 'http://localhost:3000';
  await page.goto(`${base}/admin/events/${eventId}/edit`);

  // Wait for the page to load the mocked event
  await expect(page.locator('text=Edit Event')).toBeVisible();
  await expect(page.locator('input#title')).toHaveValue('Mock Event');

  // Attach a file to the poster input. Adjust path to a test image in your repo.
  const fixtureFile = path.resolve('tests/fixtures/sample.png'); // ensure this exists
  // The poster file input is the first file input inside the form
  const posterInput = page.locator('form').locator('input[type=file]').first();
  await posterInput.waitFor({ state: 'visible', timeout: 5000 });
  await posterInput.setInputFiles(fixtureFile);

  // Submit the form (click Update Event)
  await page.click('button:has-text("Update Event")');

  // Wait for PUT to be captured
  await page.waitForTimeout(500);

  if (!capturedPutBody) throw new Error('PUT request was not captured');
  const body = JSON.parse(String(capturedPutBody));

  // Assert poster URL is the mocked upload URL
  expect(body.poster).toBe('https://res.cloudinary.com/demo/uploaded-poster.jpg');
});
