<?php

namespace App\Http\Requests\Post;

use App\Constants\ErrorCode;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class UpdatePostRequest extends FormRequest
{
    protected function failedValidation(Validator $validator)
    {
        $response = new Response(['_result' => '0', '_error' => $validator->errors()->first(), '_errorCode' => ErrorCode::UPDATE_ERROR], 200);

        throw new ValidationException($validator, $response);
    }

    public function rules()
    {
        return [
            'title' => 'required|min:3|max:50',
            'summary' => 'max:200',
            'body' => 'max:2000',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => __('post.title_required'),
            'title.min' => __('post.title_min'),
            'title.max' => __('post.title_max'),
            'summary.max' => __('post.summary_max'),
            'body.max' => __('post.body_max'),
        ];
    }
}
