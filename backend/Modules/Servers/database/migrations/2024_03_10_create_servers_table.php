<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        \Modules\Servers\Models\Server::createTable();
    }

    public function down()
    {
        Schema::dropIfExists('servers');
    }
};
