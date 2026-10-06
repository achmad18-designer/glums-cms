-- CreateTable
CREATE TABLE "tb_contact" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_contact_settings" (
    "id" SERIAL NOT NULL,
    "platform" TEXT,
    "link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_contact_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_general_settings" (
    "id" SERIAL NOT NULL,
    "pt_name" TEXT,
    "pt_address" TEXT,
    "marquee" TEXT,
    "copy_right" TEXT,
    "logo_website_name" TEXT,
    "logo_website_path" TEXT,
    "video_profile_name" TEXT,
    "video_profile_path" TEXT,
    "about_desc" TEXT,
    "team_member_desc" TEXT,
    "what_we_do_desc" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_general_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_projects" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "desc" TEXT,
    "case_study" TEXT,
    "why" TEXT,
    "logo_project_name" TEXT,
    "logo_project_path" TEXT,
    "banner_project_name" TEXT,
    "banner_project_path" TEXT,
    "img_why_name" TEXT,
    "img_why_path" TEXT,
    "images" TEXT,
    "service_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_services" (
    "id" SERIAL NOT NULL,
    "service_name" TEXT,
    "excerpt" TEXT,
    "sub_excerpt" TEXT,
    "desc" TEXT,
    "service_banner_path" TEXT,
    "service_banner_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_sub_service" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER,
    "sub_service_name" TEXT,
    "sub_service_desc" TEXT,
    "sub_service_banner_path" TEXT,
    "sub_service_banner_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_sub_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" TEXT,
    "desc" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "img" TEXT,
    "img_path" TEXT,
    "refresh_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_username_key" ON "tb_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_email_key" ON "tb_users"("email");

-- AddForeignKey
ALTER TABLE "tb_projects" ADD CONSTRAINT "tb_projects_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "tb_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_sub_service" ADD CONSTRAINT "tb_sub_service_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "tb_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
