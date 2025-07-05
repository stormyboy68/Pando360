@extends('response::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('response.name') !!}</p>
@endsection
