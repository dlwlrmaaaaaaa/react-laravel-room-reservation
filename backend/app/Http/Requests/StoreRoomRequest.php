<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_name' => ['required', 'string', 'max:155'],
            'price' => ['required', 'numeric'],
            'mini_description' => ['required', 'string'],
            'description' => ['required', 'string', 'max:255'],
            'room_amenities' => ['required'],
            'maximum_guest' => ['required'],
            'file_name.*' => ['required', 'file', 'mimes:jpeg,png,jpg,gif', 'max:25000```php
/**
 * Determine if the user is authorized to make this request.
 */
public function authorize(): bool
{
    return auth()->check();
}

/**
 * Get the validation rules that apply to the request.
 *
 * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
 */
public function rules(): array
{
    return [
        'room_name' => ['required', 'string', 'max:155'],
        'price' => ['required', 'numeric', 'min:0'],
        'mini_description' => ['required', 'string', 'max:255'],
        'description' => ['required', 'string', 'max:255'],
        'room_amenities' => ['required', 'array'],
        'maximum_guest' => ['required', 'integer', 'min:1'],
        'file_name.*' => ['required', 'file', 'mimes:jpeg,png,jpg,gif', 'max:25000'],
    ];
}

/**
 * Get the validation messages that apply to the request.
 *
 * @return array<string, string>
 */
public function messages(): array
{
    return [
        'room_name.required' => 'Room name is required',
        'price.required' => 'Price is required',
        'price.numeric' => 'Price must be a number',
        'price.min' => 'Price must be greater than or equal to 0',
        'mini_description.required' => 'Mini description is required',
        'description.required' => 'Description is required',
        'room_amenities.required' => 'Room amenities are required',
        'maximum_guest.required' => 'Maximum guest is required',
        'maximum_guest.integer' => 'Maximum guest must be an integer',
        'maximum_guest.min' => 'Maximum guest must be greater than or equal to 1',
        'file_name.*.required' => 'File name is required',
        'file_name.*.file' => 'File name must be a file',
        'file_name.*.mimes' => 'File name must be a jpeg, png, jpg, or gif',
        'file_name.*.max' => 'File name must be less than or equal to 25000',
    ];
}
```'],
        ];
    }
}
